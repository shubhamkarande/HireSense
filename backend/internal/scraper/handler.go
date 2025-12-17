package scraper

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	manager *ScraperManager
}

func NewHandler() *Handler {
	return &Handler{
		manager: NewScraperManager(),
	}
}

func (h *Handler) RegisterRoutes(r *gin.RouterGroup) {
	r.POST("/scrape", h.TriggerScrape)
	r.GET("/stats", h.GetStats)
}

func (h *Handler) TriggerScrape(c *gin.Context) {
	results := h.manager.RunAll(c.Request.Context())
	c.JSON(http.StatusOK, gin.H{
		"message": "Scrape completed",
		"results": results,
	})
}

func (h *Handler) GetStats(c *gin.Context) {
	// Placeholder for admin stats
	c.JSON(http.StatusOK, gin.H{
		"totalUsers":        0,
		"totalJobs":         0,
		"totalInteractions": 0,
		"aiUsage":           []gin.H{},
		"recentScrapes":     []gin.H{},
	})
}
