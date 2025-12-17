package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/hiresense/backend/internal/ai"
	"github.com/hiresense/backend/internal/auth"
	"github.com/hiresense/backend/internal/config"
	"github.com/hiresense/backend/internal/jobs"
	"github.com/hiresense/backend/internal/middleware"
	"github.com/hiresense/backend/internal/scraper"
	"github.com/hiresense/backend/internal/users"
)

func main() {
	// Load configuration
	config.Load()

	// Set Gin mode
	if config.AppConfig.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Create router
	r := gin.Default()

	// Global middlewares
	r.Use(middleware.CORSMiddleware())

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Initialize handlers
	authHandler := auth.NewHandler()
	usersHandler := users.NewHandler()
	jobsHandler := jobs.NewHandler()
	aiHandler := ai.NewHandler()
	scraperHandler := scraper.NewHandler()

	// Auth routes (public + protected)
	authGroup := r.Group("/auth")
	authHandler.RegisterRoutes(authGroup, middleware.AuthMiddleware())

	// Protected routes
	authMiddleware := middleware.AuthMiddleware()
	optionalAuth := middleware.OptionalAuthMiddleware()

	// Users routes
	usersGroup := r.Group("/users")
	usersGroup.Use(authMiddleware)
	usersHandler.RegisterRoutes(usersGroup)

	// Jobs routes
	jobsGroup := r.Group("/jobs")
	jobsHandler.RegisterRoutes(jobsGroup, authMiddleware, optionalAuth)

	// AI routes
	aiGroup := r.Group("/ai")
	aiGroup.Use(authMiddleware)
	aiHandler.RegisterRoutes(aiGroup)

	// Admin routes
	adminGroup := r.Group("/admin")
	adminGroup.Use(authMiddleware, middleware.AdminMiddleware())
	scraperHandler.RegisterRoutes(adminGroup)

	// Start server
	addr := ":" + config.AppConfig.Port
	log.Printf("🚀 HireSense API starting on %s", addr)
	if err := r.Run(addr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
