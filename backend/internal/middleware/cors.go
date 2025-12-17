package middleware

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hiresense/backend/internal/config"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", config.AppConfig.FrontendURL)
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Header("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func RateLimitMiddleware(rps int) gin.HandlerFunc {
	ticker := time.NewTicker(time.Second / time.Duration(rps))
	semaphore := make(chan struct{}, rps)

	go func() {
		for range ticker.C {
			select {
			case semaphore <- struct{}{}:
			default:
			}
		}
	}()

	for i := 0; i < rps; i++ {
		semaphore <- struct{}{}
	}

	return func(c *gin.Context) {
		select {
		case <-semaphore:
			c.Next()
		default:
			c.JSON(429, gin.H{"error": "Too many requests"})
			c.Abort()
		}
	}
}
