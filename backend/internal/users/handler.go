package users

import (
	"net/http"

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

func (h *Handler) RegisterRoutes(r *gin.RouterGroup) {
	r.GET("/profile", h.GetProfile)
	r.PUT("/profile", h.UpdateProfile)
	r.POST("/onboarding", h.CompleteOnboarding)
	r.GET("/interactions", h.GetInteractions)
	r.DELETE("/account", h.DeleteAccount)
}

type UpdateProfileRequest struct {
	Skills           []string    `json:"skills"`
	ExperienceLevel  string      `json:"experienceLevel"`
	SalaryRange      SalaryRange `json:"salaryRange"`
	RemotePreference string      `json:"remotePreference"`
	PreferredRoles   []string    `json:"preferredRoles"`
}

func (h *Handler) GetProfile(c *gin.Context) {
	userID := c.GetString("userId")

	user, err := h.repo.FindByID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user.ToResponse())
}

func (h *Handler) UpdateProfile(c *gin.Context) {
	userID := c.GetString("userId")

	var req UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	profile := &Profile{
		Skills:           req.Skills,
		ExperienceLevel:  req.ExperienceLevel,
		SalaryRange:      req.SalaryRange,
		RemotePreference: req.RemotePreference,
		PreferredRoles:   req.PreferredRoles,
	}

	user, err := h.repo.UpdateProfile(c.Request.Context(), userID, profile)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, user.ToResponse())
}

func (h *Handler) CompleteOnboarding(c *gin.Context) {
	// Same as UpdateProfile for now
	h.UpdateProfile(c)
}

func (h *Handler) GetInteractions(c *gin.Context) {
	// TODO: Implement interaction fetching
	c.JSON(http.StatusOK, gin.H{
		"saved":   []string{},
		"applied": []string{},
		"hidden":  []string{},
	})
}

func (h *Handler) DeleteAccount(c *gin.Context) {
	userID := c.GetString("userId")

	err := h.repo.Delete(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete account"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Account deleted"})
}
