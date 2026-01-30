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

func (r *UsersRepo) Create(ctx context.Context, email, hash, fullName, groupName, trainedLevel, skills, role string) (string, error) {
	var id string
	err := r.db.QueryRow(ctx,
		`INSERT INTO users (email, password_hash, full_name, group_name, trained_level, skills, role)
		 VALUES ($1,$2,$3,$4,$5,$6,$7)
		 RETURNING id`,
		email, hash, fullName, groupName, trainedLevel, skills, role,
	).Scan(&id)
	return id, err
}

func (r *UsersRepo) GetForLogin(ctx context.Context, email string) (id string, passwordHash string, role string, err error) {
	err = r.db.QueryRow(ctx,
		`SELECT id, password_hash, role
		 FROM users
		 WHERE email=$1 AND status='active'`,
		email,
	).Scan(&id, &passwordHash, &role)
	return
}

func (r *UsersRepo) GetByID(ctx context.Context, userID string) (email, fullName, groupName, trainedLevel, skills, role string, err error) {
	err = r.db.QueryRow(ctx,
		`SELECT email, full_name, group_name, trained_level, skills, role
		 FROM users
		 WHERE id=$1 AND status='active'`,
		userID,
	).Scan(&email, &fullName, &groupName, &trainedLevel, &skills, &role)
	return
}
