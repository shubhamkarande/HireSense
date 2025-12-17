package ai

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/hiresense/backend/internal/config"
	"github.com/hiresense/backend/internal/jobs"
	"github.com/hiresense/backend/internal/users"
	"github.com/sashabaranov/go-openai"
)

type Service struct {
	client   *openai.Client
	jobsRepo *jobs.Repository
}

func NewService() *Service {
	client := openai.NewClient(config.AppConfig.OpenAIKey)
	return &Service{
		client:   client,
		jobsRepo: jobs.NewRepository(),
	}
}

type RecommendationResult struct {
	Job         jobs.Job `json:"job"`
	Score       int      `json:"score"`
	MatchReason string   `json:"matchReason"`
	SkillMatch  []string `json:"skillMatch"`
	SkillGaps   []string `json:"skillGaps"`
}

type ProfileAnalysis struct {
	Strengths    []string           `json:"strengths"`
	Suggestions  []string           `json:"suggestions"`
	MarketDemand []MarketDemandItem `json:"marketDemand"`
}

type MarketDemandItem struct {
	Skill  string `json:"skill"`
	Demand string `json:"demand"`
}

func (s *Service) GetRecommendations(ctx context.Context, user *users.User) ([]RecommendationResult, error) {
	// Get recent jobs
	jobsResponse, err := s.jobsRepo.FindAll(ctx, &jobs.JobFilter{
		Limit: 50,
		Page:  1,
	})
	if err != nil {
		return nil, err
	}

	if len(jobsResponse.Jobs) == 0 {
		return []RecommendationResult{}, nil
	}

	// Get hidden job IDs to filter out
	hiddenIDs, _ := s.jobsRepo.GetHiddenJobIDs(ctx, user.ID.Hex())
	hiddenIDMap := make(map[string]bool)
	for _, id := range hiddenIDs {
		hiddenIDMap[id.Hex()] = true
	}

	// Filter out hidden jobs
	var filteredJobs []jobs.Job
	for _, job := range jobsResponse.Jobs {
		if !hiddenIDMap[job.ID.Hex()] {
			filteredJobs = append(filteredJobs, job)
		}
	}

	if len(filteredJobs) == 0 {
		return []RecommendationResult{}, nil
	}

	// Prepare prompt
	prompt := buildRecommendationPrompt(user.Profile, filteredJobs[:min(10, len(filteredJobs))])

	// Call OpenAI
	resp, err := s.client.CreateChatCompletion(ctx, openai.ChatCompletionRequest{
		Model: openai.GPT4oMini,
		Messages: []openai.ChatCompletionMessage{
			{
				Role:    openai.ChatMessageRoleSystem,
				Content: "You are a job matching AI. Analyze job listings against user profiles and return match scores with explanations. Always respond with valid JSON.",
			},
			{
				Role:    openai.ChatMessageRoleUser,
				Content: prompt,
			},
		},
		Temperature: 0.3,
	})
	if err != nil {
		// Fallback to simple matching if OpenAI fails
		return simpleMatch(user.Profile, filteredJobs[:min(10, len(filteredJobs))]), nil
	}

	// Parse response
	var matches []struct {
		JobIndex    int      `json:"jobIndex"`
		Score       int      `json:"score"`
		MatchReason string   `json:"matchReason"`
		SkillMatch  []string `json:"skillMatch"`
		SkillGaps   []string `json:"skillGaps"`
	}

	content := resp.Choices[0].Message.Content
	if err := json.Unmarshal([]byte(content), &matches); err != nil {
		return simpleMatch(user.Profile, filteredJobs[:min(10, len(filteredJobs))]), nil
	}

	// Build results
	results := make([]RecommendationResult, 0, len(matches))
	for _, match := range matches {
		if match.JobIndex >= 0 && match.JobIndex < len(filteredJobs) {
			results = append(results, RecommendationResult{
				Job:         filteredJobs[match.JobIndex],
				Score:       match.Score,
				MatchReason: match.MatchReason,
				SkillMatch:  match.SkillMatch,
				SkillGaps:   match.SkillGaps,
			})
		}
	}

	return results, nil
}

func (s *Service) AnalyzeProfile(ctx context.Context, profile users.Profile) (*ProfileAnalysis, error) {
	prompt := fmt.Sprintf(`Analyze this job seeker profile and provide insights:

Skills: %v
Experience Level: %s
Preferred Roles: %v
Salary Range: $%d - $%d

Respond with JSON:
{
  "strengths": ["list of profile strengths"],
  "suggestions": ["actionable suggestions to improve job prospects"],
  "marketDemand": [{"skill": "skill name", "demand": "high/medium/low"}]
}`, profile.Skills, profile.ExperienceLevel, profile.PreferredRoles, profile.SalaryRange.Min, profile.SalaryRange.Max)

	resp, err := s.client.CreateChatCompletion(ctx, openai.ChatCompletionRequest{
		Model: openai.GPT4oMini,
		Messages: []openai.ChatCompletionMessage{
			{
				Role:    openai.ChatMessageRoleSystem,
				Content: "You are a career advisor AI. Analyze profiles and provide actionable insights.",
			},
			{
				Role:    openai.ChatMessageRoleUser,
				Content: prompt,
			},
		},
		Temperature: 0.5,
	})
	if err != nil {
		// Return default analysis
		return &ProfileAnalysis{
			Strengths:   []string{"Strong technical background"},
			Suggestions: []string{"Consider adding more skills to your profile"},
			MarketDemand: []MarketDemandItem{
				{Skill: "React", Demand: "high"},
				{Skill: "Go", Demand: "high"},
			},
		}, nil
	}

	var analysis ProfileAnalysis
	if err := json.Unmarshal([]byte(resp.Choices[0].Message.Content), &analysis); err != nil {
		return &ProfileAnalysis{
			Strengths:    []string{"Diverse skill set"},
			Suggestions:  []string{"Keep your profile updated"},
			MarketDemand: []MarketDemandItem{},
		}, nil
	}

	return &analysis, nil
}

func buildRecommendationPrompt(profile users.Profile, filteredJobs []jobs.Job) string {
	jobsJSON, _ := json.Marshal(filteredJobs)
	return fmt.Sprintf(`Match these jobs to the user profile and score them:

User Profile:
- Skills: %v
- Experience: %s
- Preferred Roles: %v
- Salary Range: $%d - $%d

Jobs (indexed from 0):
%s

Return a JSON array with top 10 matches:
[{"jobIndex": 0, "score": 85, "matchReason": "Your React expertise matches...", "skillMatch": ["React", "TypeScript"], "skillGaps": ["AWS"]}]

Score 0-100. Focus on skill overlap and experience fit.`,
		profile.Skills, profile.ExperienceLevel, profile.PreferredRoles,
		profile.SalaryRange.Min, profile.SalaryRange.Max, string(jobsJSON))
}

func simpleMatch(profile users.Profile, filteredJobs []jobs.Job) []RecommendationResult {
	results := make([]RecommendationResult, 0, len(filteredJobs))

	for _, job := range filteredJobs {
		score, matched := calculateSkillMatch(profile.Skills, job.Skills)
		if score > 0 {
			results = append(results, RecommendationResult{
				Job:         job,
				Score:       score,
				MatchReason: fmt.Sprintf("Matches %d of your skills", len(matched)),
				SkillMatch:  matched,
				SkillGaps:   []string{},
			})
		}
	}

	return results
}

func calculateSkillMatch(userSkills, jobSkills []string) (int, []string) {
	skillSet := make(map[string]bool)
	for _, s := range userSkills {
		skillSet[s] = true
	}

	var matched []string
	for _, s := range jobSkills {
		if skillSet[s] {
			matched = append(matched, s)
		}
	}

	if len(jobSkills) == 0 {
		return 50, matched
	}

	score := (len(matched) * 100) / len(jobSkills)
	return score, matched
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
