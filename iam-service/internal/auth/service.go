package auth

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"time"

	"iam-service/internal/storage"
)

type Service struct {
	users  *storage.UsersRepo
	tokens *storage.TokensRepo
	jwt    *TokenManager
}

func NewService(u *storage.UsersRepo, t *storage.TokensRepo, jwt *TokenManager) *Service {
	return &Service{users: u, tokens: t, jwt: jwt}
}

func hashToken(t string) string {
	h := sha256.Sum256([]byte(t))
	return hex.EncodeToString(h[:])
}

func (s *Service) Login(ctx context.Context, email, password string) (string, string, error) {
	id, hash, err := s.users.GetByEmail(ctx, email)
	if err != nil {
		return "", "", err
	}
	if err := CheckPassword(hash, password); err != nil {
		return "", "", err
	}

	roles, _ := s.users.Roles(ctx, id)
	access, _ := s.jwt.CreateAccessToken(id, roles)

	refresh := time.Now().String() + id
	s.tokens.Save(ctx, id, hashToken(refresh), time.Now().Add(7*24*time.Hour))

	return access, refresh, nil
}
