package users

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SalaryRange struct {
	Min int `json:"min" bson:"min"`
	Max int `json:"max" bson:"max"`
}

type Profile struct {
	Skills           []string    `json:"skills" bson:"skills"`
	ExperienceLevel  string      `json:"experienceLevel" bson:"experienceLevel"`
	SalaryRange      SalaryRange `json:"salaryRange" bson:"salaryRange"`
	RemotePreference string      `json:"remotePreference" bson:"remotePreference"`
	PreferredRoles   []string    `json:"preferredRoles" bson:"preferredRoles"`
}

type User struct {
	ID           primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Email        string             `json:"email" bson:"email"`
	PasswordHash string             `json:"-" bson:"passwordHash"`
	Role         string             `json:"role" bson:"role"`
	Profile      Profile            `json:"profile" bson:"profile"`
	CreatedAt    time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt    time.Time          `json:"updatedAt" bson:"updatedAt"`
}

type UserResponse struct {
	ID        primitive.ObjectID `json:"_id"`
	Email     string             `json:"email"`
	Role      string             `json:"role"`
	Profile   Profile            `json:"profile"`
	CreatedAt time.Time          `json:"createdAt"`
}

func (u *User) ToResponse() *UserResponse {
	return &UserResponse{
		ID:        u.ID,
		Email:     u.Email,
		Role:      u.Role,
		Profile:   u.Profile,
		CreatedAt: u.CreatedAt,
	}
}
