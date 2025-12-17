package ai

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hiresense/backend/internal/users"
)

type Handler struct {
	service  *Service
	userRepo *users.Repository
}

func NewHandler() *Handler {
	return &Handler{
		service:  NewService(),
		userRepo: users.NewRepository(),
	}
}

func (h *Handler) RegisterRoutes(r *gin.RouterGroup) {
	r.GET("/recommend", h.GetRecommendations)
	r.POST("/analyze-profile", h.AnalyzeProfile)
	r.GET("/explain/:id", h.ExplainJob)
	r.GET("/suggest-skills", h.SuggestSkills)
	r.GET("/market-insights", h.GetMarketInsights)
}

func (h *Handler) GetRecommendations(c *gin.Context) {
	userID := c.GetString("userId")

	user, err := h.userRepo.FindByID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	recommendations, err := h.service.GetRecommendations(c.Request.Context(), user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get recommendations"})
		return
	}

	c.JSON(http.StatusOK, recommendations)
}

func (h *Handler) AnalyzeProfile(c *gin.Context) {
	userID := c.GetString("userId")

	user, err := h.userRepo.FindByID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	analysis, err := h.service.AnalyzeProfile(c.Request.Context(), user.Profile)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to analyze profile"})
		return
	}

	c.JSON(http.StatusOK, analysis)
}

func (h *Handler) ExplainJob(c *gin.Context) {
	// Placeholder - would use AI to explain why a specific job matches
	c.JSON(http.StatusOK, gin.H{
		"explanation": "This job matches your skills in React and TypeScript.",
		"score":       85,
	})
}

func (h *Handler) SuggestSkills(c *gin.Context) {
	// Placeholder - would use AI to suggest skills to learn
	c.JSON(http.StatusOK, []gin.H{
		{"skill": "Kubernetes", "reason": "High demand in DevOps roles"},
		{"skill": "AWS", "reason": "Most common cloud platform"},
		{"skill": "GraphQL", "reason": "Growing adoption in modern APIs"},
	})
}

func (h *Handler) GetMarketInsights(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"trendingSkills": []gin.H{
			{"skill": "AI/ML", "growth": 45},
			{"skill": "Rust", "growth": 32},
			{"skill": "Kubernetes", "growth": 28},
		},
		"salaryTrends": []gin.H{
			{"role": "Frontend Developer", "avgSalary": 95000},
			{"role": "Backend Developer", "avgSalary": 105000},
			{"role": "DevOps Engineer", "avgSalary": 125000},
		},
	})
}
