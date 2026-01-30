package storage

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type UsersRepo struct {
	db *pgxpool.Pool
}

func NewUsersRepo(db *pgxpool.Pool) *UsersRepo {
	return &UsersRepo{db: db}
}

func (r *UsersRepo) Create(ctx context.Context, email, hash, name string) (string, error) {
	var id string
	err := r.db.QueryRow(ctx,
		`INSERT INTO users (email, password_hash, name)
		 VALUES ($1,$2,$3) RETURNING id`,
		email, hash, name,
	).Scan(&id)
	return id, err
}

func (r *UsersRepo) GetByEmail(ctx context.Context, email string) (string, string, error) {
	var id, hash string
	err := r.db.QueryRow(ctx,
		`SELECT id, password_hash FROM users WHERE email=$1 AND status='active'`,
		email,
	).Scan(&id, &hash)
	return id, hash, err
}

func (r *UsersRepo) Roles(ctx context.Context, userID string) ([]string, error) {
	rows, err := r.db.Query(ctx,
		`SELECT role FROM user_roles WHERE user_id=$1`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var roles []string
	for rows.Next() {
		var r string
		rows.Scan(&r)
		roles = append(roles, r)
	}
	return roles, nil
}
