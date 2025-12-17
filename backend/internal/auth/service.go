package auth

import (
	"context"
	"errors"

	"github.com/hiresense/backend/internal/users"
	"github.com/hiresense/backend/pkg/jwt"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrUserExists         = errors.New("user already exists")
)

type Service struct {
	userRepo *users.Repository
}

func NewService() *Service {
	return &Service{
		userRepo: users.NewRepository(),
	}
}

type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type RefreshRequest struct {
	RefreshToken string `json:"refreshToken" binding:"required"`
}

type AuthResponse struct {
	User         *users.UserResponse `json:"user"`
	AccessToken  string              `json:"accessToken"`
	RefreshToken string              `json:"refreshToken"`
}

func (s *Service) Register(ctx context.Context, req *RegisterRequest) (*AuthResponse, error) {
	// Check if user exists
	existing, _ := s.userRepo.FindByEmail(ctx, req.Email)
	if existing != nil {
		return nil, ErrUserExists
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// Create user
	user := &users.User{
		Email:        req.Email,
		PasswordHash: string(hashedPassword),
		Role:         "user",
	}

	if err := s.userRepo.Create(ctx, user); err != nil {
		return nil, err
	}

	// Generate tokens
	tokens, err := jwt.GenerateTokenPair(user.ID.Hex(), user.Email, user.Role)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{
		User:         user.ToResponse(),
		AccessToken:  tokens.AccessToken,
		RefreshToken: tokens.RefreshToken,
	}, nil
}

func (s *Service) Login(ctx context.Context, req *LoginRequest) (*AuthResponse, error) {
	// Find user
	user, err := s.userRepo.FindByEmail(ctx, req.Email)
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, ErrInvalidCredentials
	}

	// Generate tokens
	tokens, err := jwt.GenerateTokenPair(user.ID.Hex(), user.Email, user.Role)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{
		User:         user.ToResponse(),
		AccessToken:  tokens.AccessToken,
		RefreshToken: tokens.RefreshToken,
	}, nil
}

func (s *Service) Refresh(ctx context.Context, refreshToken string) (*jwt.TokenPair, error) {
	claims, err := jwt.ValidateToken(refreshToken)
	if err != nil {
		return nil, err
	}

	// Generate new token pair
	return jwt.GenerateTokenPair(claims.UserID, claims.Email, claims.Role)
}

func (s *Service) GetCurrentUser(ctx context.Context, userID string) (*users.UserResponse, error) {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return nil, err
	}
	return user.ToResponse(), nil
}
