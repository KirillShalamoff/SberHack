package service

import (
	"context"
	"errors"
	"iam-service/internal/storage"
	"time"
)

type AdminService struct {
	usersRepo *storage.UsersRepo
}

func NewAdminService(usersRepo *storage.UsersRepo) *AdminService {
	return &AdminService{
		usersRepo: usersRepo,
	}
}

// UpdateUser обновляет данные пользователя
func (s *AdminService) UpdateUser(ctx context.Context, userID int, updateData map[string]interface{}) error {
	// Проверяем, что пользователь существует
	_, err := s.usersRepo.GetByID(ctx, userID)
	if err != nil {
		return errors.New("user not found")
	}

	// Валидация роли
	if role, ok := updateData["role"].(string); ok {
		validRoles := map[string]bool{
			"student": true,
			"curator": true,
			"admin":   true,
			"company": true,
		}
		if !validRoles[role] {
			return errors.New("invalid role")
		}
	}

	// Валидация статуса
	if status, ok := updateData["status"].(string); ok {
		validStatuses := map[string]bool{
			"active":   true,
			"inactive": true,
			"deleted":  true,
		}
		if !validStatuses[status] {
			return errors.New("invalid status")
		}
	}

	// Добавляем время обновления
	updateData["updated_at"] = time.Now()

	return s.usersRepo.Update(ctx, userID, updateData)
}

// GetUsers возвращает список пользователей с фильтрацией
func (s *AdminService) GetUsers(ctx context.Context, filters map[string]string, page, limit int) ([]storage.User, int, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}
	offset := (page - 1) * limit

	users, err := s.usersRepo.GetAll(ctx, filters, limit, offset)
	if err != nil {
		return nil, 0, err
	}

	total, err := s.usersRepo.Count(ctx, filters)
	if err != nil {
		return nil, 0, err
	}

	return users, total, nil
}

// GetUserByID возвращает пользователя по ID
func (s *AdminService) GetUserByID(ctx context.Context, id int) (*storage.User, error) {
	return s.usersRepo.GetByID(ctx, id)
}

// GetStats возвращает статистику по пользователям
func (s *AdminService) GetStats(ctx context.Context) (map[string]interface{}, error) {
	return s.usersRepo.GetStats(ctx)
}

// ChangeUserRole изменяет роль пользователя
func (s *AdminService) ChangeUserRole(ctx context.Context, userID int, newRole string) error {
	updateData := map[string]interface{}{
		"role": newRole,
	}
	return s.UpdateUser(ctx, userID, updateData)
}

// ChangeUserStatus изменяет статус пользователя
func (s *AdminService) ChangeUserStatus(ctx context.Context, userID int, newStatus string) error {
	updateData := map[string]interface{}{
		"status": newStatus,
	}
	return s.UpdateUser(ctx, userID, updateData)
}
