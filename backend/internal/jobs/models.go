package jobs

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Job struct {
	ID          primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Title       string             `json:"title" bson:"title"`
	Company     string             `json:"company" bson:"company"`
	Description string             `json:"description" bson:"description"`
	Skills      []string           `json:"skills" bson:"skills"`
	Salary      string             `json:"salary" bson:"salary"`
	Location    string             `json:"location" bson:"location"`
	Source      string             `json:"source" bson:"source"`
	URL         string             `json:"url" bson:"url"`
	SourceID    string             `json:"sourceId" bson:"sourceId"`
	PostedAt    time.Time          `json:"postedAt" bson:"postedAt"`
	ScrapedAt   time.Time          `json:"scrapedAt" bson:"scrapedAt"`
	AIScore     float64            `json:"aiScore,omitempty" bson:"aiScore,omitempty"`
	MatchReason string             `json:"matchReason,omitempty" bson:"matchReason,omitempty"`
	IsActive    bool               `json:"isActive" bson:"isActive"`
}

type UserInteraction struct {
	ID        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	UserID    primitive.ObjectID `json:"userId" bson:"userId"`
	JobID     primitive.ObjectID `json:"jobId" bson:"jobId"`
	Action    string             `json:"action" bson:"action"` // saved, applied, hidden
	Timestamp time.Time          `json:"timestamp" bson:"timestamp"`
}

type JobsResponse struct {
	Jobs       []Job `json:"jobs"`
	Total      int64 `json:"total"`
	Page       int   `json:"page"`
	TotalPages int   `json:"totalPages"`
}

type JobFilter struct {
	Search          string   `form:"search"`
	Skills          []string `form:"skills"`
	ExperienceLevel string   `form:"experienceLevel"`
	SalaryMin       int      `form:"salaryMin"`
	SalaryMax       int      `form:"salaryMax"`
	Source          string   `form:"source"`
	Page            int      `form:"page,default=1"`
	Limit           int      `form:"limit,default=20"`
}
