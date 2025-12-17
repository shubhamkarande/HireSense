package scraper

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/hiresense/backend/internal/jobs"
)

type Scraper interface {
	Name() string
	Scrape(ctx context.Context) ([]jobs.Job, error)
}

type ScraperManager struct {
	scrapers []Scraper
	jobsRepo *jobs.Repository
}

func NewScraperManager() *ScraperManager {
	return &ScraperManager{
		scrapers: []Scraper{
			NewRemoteOKScraper(),
			NewRemotiveScraper(),
		},
		jobsRepo: jobs.NewRepository(),
	}
}

type ScrapeResult struct {
	Source      string    `json:"source"`
	JobsScraped int       `json:"jobsScraped"`
	JobsAdded   int       `json:"jobsAdded"`
	JobsUpdated int       `json:"jobsUpdated"`
	Errors      []string  `json:"errors"`
	StartedAt   time.Time `json:"startedAt"`
	CompletedAt time.Time `json:"completedAt"`
}

func (m *ScraperManager) RunAll(ctx context.Context) []ScrapeResult {
	results := make([]ScrapeResult, 0, len(m.scrapers))

	for _, scraper := range m.scrapers {
		result := m.runScraper(ctx, scraper)
		results = append(results, result)
	}

	return results
}

func (m *ScraperManager) runScraper(ctx context.Context, scraper Scraper) ScrapeResult {
	result := ScrapeResult{
		Source:    scraper.Name(),
		StartedAt: time.Now(),
		Errors:    []string{},
	}

	jobsList, err := scraper.Scrape(ctx)
	if err != nil {
		result.Errors = append(result.Errors, err.Error())
		result.CompletedAt = time.Now()
		return result
	}

	result.JobsScraped = len(jobsList)

	// Store jobs
	added, updated, err := m.jobsRepo.BulkUpsert(ctx, jobsList)
	if err != nil {
		result.Errors = append(result.Errors, err.Error())
	}

	result.JobsAdded = added
	result.JobsUpdated = updated
	result.CompletedAt = time.Now()

	log.Printf("✅ %s: scraped %d, added %d, updated %d",
		scraper.Name(), result.JobsScraped, result.JobsAdded, result.JobsUpdated)

	return result
}

// RemoteOK Scraper
type RemoteOKScraper struct {
	client *http.Client
}

func NewRemoteOKScraper() *RemoteOKScraper {
	return &RemoteOKScraper{
		client: &http.Client{Timeout: 30 * time.Second},
	}
}

func (s *RemoteOKScraper) Name() string { return "RemoteOK" }

func (s *RemoteOKScraper) Scrape(ctx context.Context) ([]jobs.Job, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", "https://remoteok.com/api", nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", "HireSense Job Aggregator")

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var rawJobs []map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&rawJobs); err != nil {
		return nil, err
	}

	result := make([]jobs.Job, 0, len(rawJobs))
	for _, raw := range rawJobs {
		// Skip first item (legal notice)
		if raw["id"] == nil {
			continue
		}

		job := jobs.Job{
			Title:       getString(raw, "position"),
			Company:     getString(raw, "company"),
			Description: getString(raw, "description"),
			Salary:      getString(raw, "salary"),
			Location:    getString(raw, "location", "Remote"),
			URL:         getString(raw, "url"),
			Source:      "RemoteOK",
			SourceID:    fmt.Sprintf("%v", raw["id"]),
			Skills:      parseSkills(getString(raw, "tags")),
			IsActive:    true,
		}

		if dateStr := getString(raw, "date"); dateStr != "" {
			if t, err := time.Parse("2006-01-02T15:04:05", dateStr); err == nil {
				job.PostedAt = t
			}
		}

		if job.Title != "" && job.Company != "" {
			result = append(result, job)
		}
	}

	return result, nil
}

// Remotive Scraper
type RemotiveScraper struct {
	client *http.Client
}

func NewRemotiveScraper() *RemotiveScraper {
	return &RemotiveScraper{
		client: &http.Client{Timeout: 30 * time.Second},
	}
}

func (s *RemotiveScraper) Name() string { return "Remotive" }

func (s *RemotiveScraper) Scrape(ctx context.Context) ([]jobs.Job, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", "https://remotive.com/api/remote-jobs", nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", "HireSense Job Aggregator")

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var response struct {
		Jobs []map[string]interface{} `json:"jobs"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return nil, err
	}

	result := make([]jobs.Job, 0, len(response.Jobs))
	for _, raw := range response.Jobs {
		job := jobs.Job{
			Title:       getString(raw, "title"),
			Company:     getString(raw, "company_name"),
			Description: getString(raw, "description"),
			Salary:      getString(raw, "salary"),
			Location:    getString(raw, "candidate_required_location", "Worldwide"),
			URL:         getString(raw, "url"),
			Source:      "Remotive",
			SourceID:    fmt.Sprintf("%v", raw["id"]),
			Skills:      parseTagsArray(raw["tags"]),
			IsActive:    true,
		}

		if dateStr := getString(raw, "publication_date"); dateStr != "" {
			if t, err := time.Parse("2006-01-02T15:04:05", dateStr); err == nil {
				job.PostedAt = t
			}
		}

		if job.Title != "" && job.Company != "" {
			result = append(result, job)
		}
	}

	return result, nil
}

// Helper functions
func getString(m map[string]interface{}, key string, defaultVal ...string) string {
	if v, ok := m[key]; ok {
		if s, ok := v.(string); ok {
			return s
		}
	}
	if len(defaultVal) > 0 {
		return defaultVal[0]
	}
	return ""
}

func parseSkills(tagsStr string) []string {
	if tagsStr == "" {
		return []string{}
	}
	parts := strings.Split(tagsStr, ",")
	result := make([]string, 0, len(parts))
	for _, p := range parts {
		trimmed := strings.TrimSpace(p)
		if trimmed != "" {
			result = append(result, trimmed)
		}
	}
	return result
}

func parseTagsArray(v interface{}) []string {
	if arr, ok := v.([]interface{}); ok {
		result := make([]string, 0, len(arr))
		for _, item := range arr {
			if s, ok := item.(string); ok {
				result = append(result, s)
			}
		}
		return result
	}
	return []string{}
}
