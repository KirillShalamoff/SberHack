package storage

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type User struct {
	ID           int       `json:"id"`
	Email        string    `json:"email"`
	FullName     string    `json:"full_name"`
	GroupName    *string   `json:"group_name,omitempty"`
	TrainedLevel *string   `json:"trained_level,omitempty"`
	Skills       *string   `json:"skills,omitempty"`
	Role         string    `json:"role"`
	Status       string    `json:"status"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type UsersRepo struct {
	db *pgxpool.Pool
}

func NewUsersRepo(db *pgxpool.Pool) *UsersRepo {
	return &UsersRepo{db: db}
}

// Создание пользователя
func (r *UsersRepo) Create(ctx context.Context, email, hash, fullName string, role string) (int, error) {
	var id int
	err := r.db.QueryRow(ctx,
		`INSERT INTO users (email, password_hash, full_name, role)
		 VALUES ($1, $2, $3, $4) RETURNING user_id`,
		email, hash, fullName, role,
	).Scan(&id)
	return id, err
}

// Получение пользователя по email
func (r *UsersRepo) GetByEmail(ctx context.Context, email string) (*User, error) {
	var user User
	err := r.db.QueryRow(ctx,
		`SELECT user_id, email, password_hash, full_name, group_name, trained_level, skills, role, status
		 FROM users WHERE email=$1`,
		email,
	).Scan(&user.ID, &user.Email, &user.FullName, &user.GroupName, &user.TrainedLevel, &user.Skills, &user.Role, &user.Status)

	if err != nil {
		return nil, err
	}
	return &user, nil
}

// Получение пользователя по ID
func (r *UsersRepo) GetByID(ctx context.Context, id int) (*User, error) {
	var user User
	err := r.db.QueryRow(ctx,
		`SELECT user_id, email, full_name, group_name, trained_level, skills, role, status
		 FROM users WHERE user_id=$1`,
		id,
	).Scan(&user.ID, &user.Email, &user.FullName, &user.GroupName, &user.TrainedLevel, &user.Skills, &user.Role, &user.Status)

	if err != nil {
		return nil, err
	}
	return &user, nil
}

// Получение хеша пароля для аутентификации
func (r *UsersRepo) GetPasswordHash(ctx context.Context, email string) (int, string, error) {
	var id int
	var hash string
	err := r.db.QueryRow(ctx,
		`SELECT user_id, password_hash FROM users WHERE email=$1 AND status='active'`,
		email,
	).Scan(&id, &hash)
	return id, hash, err
}

// Получение роли пользователя
func (r *UsersRepo) GetRole(ctx context.Context, userID int) (string, error) {
	var role string
	err := r.db.QueryRow(ctx,
		`SELECT role FROM users WHERE user_id=$1`,
		userID,
	).Scan(&role)
	return role, err
}

// Обновление пользователя
func (r *UsersRepo) Update(ctx context.Context, id int, updateData map[string]interface{}) error {
	query := "UPDATE users SET "
	values := []interface{}{}
	paramCount := 1

	for key, value := range updateData {
		if key == "password_hash" || key == "updated_at" {
			continue // Пароль обновляем отдельно, updated_at ставим автоматически
		}
		if paramCount > 1 {
			query += ", "
		}
		query += key + "=$" + string(rune('0'+paramCount))
		values = append(values, value)
		paramCount++
	}

	// Добавляем updated_at
	if paramCount > 1 {
		query += ", "
	}
	query += "updated_at=NOW() "

	// Добавляем WHERE
	query += "WHERE user_id=$" + string(rune('0'+paramCount))
	values = append(values, id)

	_, err := r.db.Exec(ctx, query, values...)
	return err
}

// Обновление пароля
func (r *UsersRepo) UpdatePassword(ctx context.Context, id int, hash string) error {
	_, err := r.db.Exec(ctx,
		`UPDATE users SET password_hash=$1, updated_at=NOW() WHERE user_id=$2`,
		hash, id,
	)
	return err
}

// Получение всех пользователей с фильтрацией
func (r *UsersRepo) GetAll(ctx context.Context, filters map[string]string, limit, offset int) ([]User, error) {
	query := `
		SELECT user_id, email, full_name, group_name, trained_level, skills, role, status
		FROM users WHERE 1=1
	`
	values := []interface{}{}
	paramCount := 1

	// Фильтрация по роли
	if role, ok := filters["role"]; ok && role != "" {
		query += " AND role=$" + string(rune('0'+paramCount))
		values = append(values, role)
		paramCount++
	}

	// Фильтрация по статусу
	if status, ok := filters["status"]; ok && status != "" {
		query += " AND status=$" + string(rune('0'+paramCount))
		values = append(values, status)
		paramCount++
	}

	// Поиск по email или имени
	if search, ok := filters["search"]; ok && search != "" {
		query += " AND (email ILIKE $" + string(rune('0'+paramCount)) +
			" OR full_name ILIKE $" + string(rune('0'+paramCount)) + ")"
		values = append(values, "%"+search+"%")
		paramCount++
	}

	// Сортировка и пагинация
	query += " ORDER BY user_id DESC LIMIT $" + string(rune('0'+paramCount)) +
		" OFFSET $" + string(rune('0'+paramCount+1))
	values = append(values, limit, offset)

	rows, err := r.db.Query(ctx, query, values...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		err := rows.Scan(&user.ID, &user.Email, &user.FullName, &user.GroupName,
			&user.TrainedLevel, &user.Skills, &user.Role, &user.Status)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}

// Получение количества пользователей (для пагинации)
func (r *UsersRepo) Count(ctx context.Context, filters map[string]string) (int, error) {
	query := "SELECT COUNT(*) FROM users WHERE 1=1"
	values := []interface{}{}
	paramCount := 1

	// Фильтрация по роли
	if role, ok := filters["role"]; ok && role != "" {
		query += " AND role=$" + string(rune('0'+paramCount))
		values = append(values, role)
		paramCount++
	}

	// Фильтрация по статусу
	if status, ok := filters["status"]; ok && status != "" {
		query += " AND status=$" + string(rune('0'+paramCount))
		values = append(values, status)
		paramCount++
	}

	// Поиск по email или имени
	if search, ok := filters["search"]; ok && search != "" {
		query += " AND (email ILIKE $" + string(rune('0'+paramCount)) +
			" OR full_name ILIKE $" + string(rune('0'+paramCount)) + ")"
		values = append(values, "%"+search+"%")
		paramCount++
	}

	var count int
	err := r.db.QueryRow(ctx, query, values...).Scan(&count)
	return count, err
}

// Изменение статуса пользователя
func (r *UsersRepo) ChangeStatus(ctx context.Context, id int, status string) error {
	_, err := r.db.Exec(ctx,
		`UPDATE users SET status=$1, updated_at=NOW() WHERE user_id=$2`,
		status, id,
	)
	return err
}

// Изменение роли пользователя
func (r *UsersRepo) ChangeRole(ctx context.Context, id int, role string) error {
	_, err := r.db.Exec(ctx,
		`UPDATE users SET role=$1, updated_at=NOW() WHERE user_id=$2`,
		role, id,
	)
	return err
}

// Удаление пользователя (мягкое удаление)
func (r *UsersRepo) Delete(ctx context.Context, id int) error {
	_, err := r.db.Exec(ctx,
		`UPDATE users SET status='deleted', updated_at=NOW() WHERE user_id=$1`,
		id,
	)
	return err
}

// Получение статистики по пользователям
func (r *UsersRepo) GetStats(ctx context.Context) (map[string]interface{}, error) {
	stats := make(map[string]interface{})

	// Общее количество пользователей
	var total int
	err := r.db.QueryRow(ctx, "SELECT COUNT(*) FROM users WHERE status != 'deleted'").Scan(&total)
	if err != nil {
		return nil, err
	}
	stats["total_users"] = total

	// Количество по ролям
	rows, err := r.db.Query(ctx,
		"SELECT role, COUNT(*) as count FROM users WHERE status != 'deleted' GROUP BY role")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	roleStats := make(map[string]int)
	for rows.Next() {
		var role string
		var count int
		rows.Scan(&role, &count)
		roleStats[role] = count
	}
	stats["by_role"] = roleStats

	// Количество по статусу
	rows, err = r.db.Query(ctx,
		"SELECT status, COUNT(*) as count FROM users GROUP BY status")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	statusStats := make(map[string]int)
	for rows.Next() {
		var status string
		var count int
		rows.Scan(&status, &count)
		statusStats[status] = count
	}
	stats["by_status"] = statusStats

	return stats, nil
}
