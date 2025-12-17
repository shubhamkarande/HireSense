package jobs

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	repo *Repository
}

func NewHandler() *Handler {
	return &Handler{
		repo: NewRepository(),
	}
}

func (h *Handler) RegisterRoutes(r *gin.RouterGroup, authMiddleware, optionalAuth gin.HandlerFunc) {
	r.GET("", optionalAuth, h.GetJobs)
	r.GET("/saved", authMiddleware, h.GetSavedJobs)
	r.GET("/sources", h.GetSources)
	r.GET("/:id", optionalAuth, h.GetJob)
	r.POST("/:id/save", authMiddleware, h.SaveJob)
	r.DELETE("/:id/save", authMiddleware, h.UnsaveJob)
	r.POST("/:id/hide", authMiddleware, h.HideJob)
	r.POST("/:id/apply", authMiddleware, h.TrackApply)
}

func (h *Handler) GetJobs(c *gin.Context) {
	var filter JobFilter
	if err := c.ShouldBindQuery(&filter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Parse skills from comma-separated string
	if skills := c.Query("skills"); skills != "" {
		filter.Skills = strings.Split(skills, ",")
	}

	response, err := h.repo.FindAll(c.Request.Context(), &filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch jobs"})
		return
	}

	c.JSON(http.StatusOK, response)
}

func (h *Handler) GetJob(c *gin.Context) {
	jobID := c.Param("id")

	job, err := h.repo.FindByID(c.Request.Context(), jobID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Job not found"})
		return
	}

	c.JSON(http.StatusOK, job)
}

func (h *Handler) GetSavedJobs(c *gin.Context) {
	userID := c.GetString("userId")

	jobs, err := h.repo.GetSavedJobs(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch saved jobs"})
		return
	}

	c.JSON(http.StatusOK, jobs)
}

func (h *Handler) SaveJob(c *gin.Context) {
	userID := c.GetString("userId")
	jobID := c.Param("id")

	if err := h.repo.SaveJob(c.Request.Context(), userID, jobID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save job"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Job saved"})
}

func (h *Handler) UnsaveJob(c *gin.Context) {
	userID := c.GetString("userId")
	jobID := c.Param("id")

	if err := h.repo.UnsaveJob(c.Request.Context(), userID, jobID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unsave job"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Job unsaved"})
}

func (h *Handler) HideJob(c *gin.Context) {
	userID := c.GetString("userId")
	jobID := c.Param("id")

	if err := h.repo.HideJob(c.Request.Context(), userID, jobID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hide job"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Job hidden"})
}

func (h *Handler) TrackApply(c *gin.Context) {
	// Track application
	c.JSON(http.StatusOK, gin.H{"message": "Application tracked"})
}

func (h *Handler) GetSources(c *gin.Context) {
	sources := []string{"RemoteOK", "WeWorkRemotely", "Remotive", "Lever"}
	c.JSON(http.StatusOK, sources)
}
