package storage

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type TokensRepo struct {
	db *pgxpool.Pool
}

func NewTokensRepo(db *pgxpool.Pool) *TokensRepo {
	return &TokensRepo{db: db}
}

func (r *TokensRepo) Save(ctx context.Context, userID, hash string, exp time.Time) error {
	_, err := r.db.Exec(ctx,
		`INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
		 VALUES ($1,$2,$3)`,
		userID, hash, exp,
	)
	return err
}
