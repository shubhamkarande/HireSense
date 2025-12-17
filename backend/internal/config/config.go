package config

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Config struct {
	Port           string
	MongoURI       string
	JWTSecret      string
	OpenAIKey      string
	FrontendURL    string
	Environment    string
}

var (
	AppConfig *Config
	MongoDB   *mongo.Database
)

func Load() {
	// Load .env file if it exists
	_ = godotenv.Load()

	AppConfig = &Config{
		Port:        getEnv("PORT", "8080"),
		MongoURI:    getEnv("MONGO_URI", "mongodb://localhost:27017/hiresense"),
		JWTSecret:   getEnv("JWT_SECRET", "your-super-secret-jwt-key-change-in-production"),
		OpenAIKey:   getEnv("OPENAI_API_KEY", ""),
		FrontendURL: getEnv("FRONTEND_URL", "http://localhost:5173"),
		Environment: getEnv("ENVIRONMENT", "development"),
	}

	// Connect to MongoDB
	connectMongoDB()
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func connectMongoDB() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI(AppConfig.MongoURI)
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	// Ping the database
	if err = client.Ping(ctx, nil); err != nil {
		log.Fatalf("Failed to ping MongoDB: %v", err)
	}

	MongoDB = client.Database("hiresense")
	log.Println("✅ Connected to MongoDB")
}

func GetCollection(name string) *mongo.Collection {
	return MongoDB.Collection(name)
}
