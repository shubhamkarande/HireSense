package jobs

import (
	"context"
	"errors"
	"time"

	"github.com/hiresense/backend/internal/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	ErrJobNotFound = errors.New("job not found")
)

type Repository struct {
	jobs         *mongo.Collection
	interactions *mongo.Collection
}

func NewRepository() *Repository {
	return &Repository{
		jobs:         config.GetCollection("jobs"),
		interactions: config.GetCollection("user_interactions"),
	}
}

func (r *Repository) FindAll(ctx context.Context, filter *JobFilter) (*JobsResponse, error) {
	query := bson.M{"isActive": true}

	// Search filter
	if filter.Search != "" {
		query["$or"] = []bson.M{
			{"title": bson.M{"$regex": filter.Search, "$options": "i"}},
			{"company": bson.M{"$regex": filter.Search, "$options": "i"}},
			{"description": bson.M{"$regex": filter.Search, "$options": "i"}},
		}
	}

	// Skills filter
	if len(filter.Skills) > 0 {
		query["skills"] = bson.M{"$in": filter.Skills}
	}

	// Source filter
	if filter.Source != "" {
		query["source"] = filter.Source
	}

	// Count total
	total, err := r.jobs.CountDocuments(ctx, query)
	if err != nil {
		return nil, err
	}

	// Pagination
	if filter.Page < 1 {
		filter.Page = 1
	}
	if filter.Limit < 1 || filter.Limit > 100 {
		filter.Limit = 20
	}

	skip := (filter.Page - 1) * filter.Limit
	opts := options.Find().
		SetSort(bson.M{"postedAt": -1}).
		SetSkip(int64(skip)).
		SetLimit(int64(filter.Limit))

	cursor, err := r.jobs.Find(ctx, query, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var jobs []Job
	if err := cursor.All(ctx, &jobs); err != nil {
		return nil, err
	}

	totalPages := int(total) / filter.Limit
	if int(total)%filter.Limit > 0 {
		totalPages++
	}

	return &JobsResponse{
		Jobs:       jobs,
		Total:      total,
		Page:       filter.Page,
		TotalPages: totalPages,
	}, nil
}

func (r *Repository) FindByID(ctx context.Context, id string) (*Job, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, ErrJobNotFound
	}

	var job Job
	err = r.jobs.FindOne(ctx, bson.M{"_id": objectID}).Decode(&job)
	if err != nil {
		return nil, ErrJobNotFound
	}
	return &job, nil
}

func (r *Repository) UpsertJob(ctx context.Context, job *Job) error {
	filter := bson.M{
		"sourceId": job.SourceID,
		"source":   job.Source,
	}

	update := bson.M{
		"$set": job,
		"$setOnInsert": bson.M{
			"scrapedAt": time.Now(),
		},
	}

	opts := options.Update().SetUpsert(true)
	_, err := r.jobs.UpdateOne(ctx, filter, update, opts)
	return err
}

func (r *Repository) BulkUpsert(ctx context.Context, jobs []Job) (int, int, error) {
	var added, updated int

	for _, job := range jobs {
		filter := bson.M{
			"sourceId": job.SourceID,
			"source":   job.Source,
		}

		var existing Job
		err := r.jobs.FindOne(ctx, filter).Decode(&existing)
		isNew := errors.Is(err, mongo.ErrNoDocuments)

		if err := r.UpsertJob(ctx, &job); err != nil {
			continue
		}

		if isNew {
			added++
		} else {
			updated++
		}
	}

	return added, updated, nil
}

func (r *Repository) SaveJob(ctx context.Context, userID, jobID string) error {
	userOID, _ := primitive.ObjectIDFromHex(userID)
	jobOID, _ := primitive.ObjectIDFromHex(jobID)

	interaction := &UserInteraction{
		UserID:    userOID,
		JobID:     jobOID,
		Action:    "saved",
		Timestamp: time.Now(),
	}

	_, err := r.interactions.InsertOne(ctx, interaction)
	return err
}

func (r *Repository) UnsaveJob(ctx context.Context, userID, jobID string) error {
	userOID, _ := primitive.ObjectIDFromHex(userID)
	jobOID, _ := primitive.ObjectIDFromHex(jobID)

	_, err := r.interactions.DeleteOne(ctx, bson.M{
		"userId": userOID,
		"jobId":  jobOID,
		"action": "saved",
	})
	return err
}

func (r *Repository) HideJob(ctx context.Context, userID, jobID string) error {
	userOID, _ := primitive.ObjectIDFromHex(userID)
	jobOID, _ := primitive.ObjectIDFromHex(jobID)

	interaction := &UserInteraction{
		UserID:    userOID,
		JobID:     jobOID,
		Action:    "hidden",
		Timestamp: time.Now(),
	}

	_, err := r.interactions.InsertOne(ctx, interaction)
	return err
}

func (r *Repository) GetSavedJobs(ctx context.Context, userID string) ([]Job, error) {
	userOID, _ := primitive.ObjectIDFromHex(userID)

	// Get saved job IDs
	cursor, err := r.interactions.Find(ctx, bson.M{
		"userId": userOID,
		"action": "saved",
	})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var interactions []UserInteraction
	if err := cursor.All(ctx, &interactions); err != nil {
		return nil, err
	}

	jobIDs := make([]primitive.ObjectID, len(interactions))
	for i, interaction := range interactions {
		jobIDs[i] = interaction.JobID
	}

	if len(jobIDs) == 0 {
		return []Job{}, nil
	}

	// Get jobs
	jobCursor, err := r.jobs.Find(ctx, bson.M{"_id": bson.M{"$in": jobIDs}})
	if err != nil {
		return nil, err
	}
	defer jobCursor.Close(ctx)

	var jobs []Job
	if err := jobCursor.All(ctx, &jobs); err != nil {
		return nil, err
	}

	return jobs, nil
}

func (r *Repository) GetHiddenJobIDs(ctx context.Context, userID string) ([]primitive.ObjectID, error) {
	userOID, _ := primitive.ObjectIDFromHex(userID)

	cursor, err := r.interactions.Find(ctx, bson.M{
		"userId": userOID,
		"action": "hidden",
	})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var interactions []UserInteraction
	if err := cursor.All(ctx, &interactions); err != nil {
		return nil, err
	}

	ids := make([]primitive.ObjectID, len(interactions))
	for i, interaction := range interactions {
		ids[i] = interaction.JobID
	}

	return ids, nil
}
