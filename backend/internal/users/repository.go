package users

import (
	"context"
	"errors"
	"time"

	"github.com/hiresense/backend/internal/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var (
	ErrUserNotFound     = errors.New("user not found")
	ErrUserExists       = errors.New("user already exists")
	ErrInvalidObjectID  = errors.New("invalid object id")
)

type Repository struct {
	collection *mongo.Collection
}

func NewRepository() *Repository {
	return &Repository{
		collection: config.GetCollection("users"),
	}
}

func (r *Repository) Create(ctx context.Context, user *User) error {
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()
	user.Profile = Profile{
		Skills:           []string{},
		ExperienceLevel:  "mid",
		SalaryRange:      SalaryRange{Min: 50000, Max: 150000},
		RemotePreference: "global",
		PreferredRoles:   []string{},
	}

	result, err := r.collection.InsertOne(ctx, user)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			return ErrUserExists
		}
		return err
	}

	user.ID = result.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *Repository) FindByEmail(ctx context.Context, email string) (*User, error) {
	var user User
	err := r.collection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}
	return &user, nil
}

func (r *Repository) FindByID(ctx context.Context, id string) (*User, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, ErrInvalidObjectID
	}

	var user User
	err = r.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&user)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}
	return &user, nil
}

func (r *Repository) UpdateProfile(ctx context.Context, id string, profile *Profile) (*User, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, ErrInvalidObjectID
	}

	update := bson.M{
		"$set": bson.M{
			"profile":   profile,
			"updatedAt": time.Now(),
		},
	}

	_, err = r.collection.UpdateByID(ctx, objectID, update)
	if err != nil {
		return nil, err
	}

	return r.FindByID(ctx, id)
}

func (r *Repository) Delete(ctx context.Context, id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return ErrInvalidObjectID
	}

	_, err = r.collection.DeleteOne(ctx, bson.M{"_id": objectID})
	return err
}
