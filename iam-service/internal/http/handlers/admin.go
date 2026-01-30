package handlers

import (
	"encoding/json"
	"iam-service/internal/service"
	"net/http"
	"strconv"
)

type AdminHandler struct {
	adminService *service.AdminService
}

func NewAdminHandler(adminService *service.AdminService) *AdminHandler {
	return &AdminHandler{
		adminService: adminService,
	}
}

// Обновить пользователя
// PUT /api/admin/users/{id}
func (h *AdminHandler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.PathValue("id")
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		http.Error(w, `{"error": "Invalid user ID"}`, http.StatusBadRequest)
		return
	}

	var updateData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	ctx := r.Context()

	err = h.adminService.UpdateUser(ctx, userID, updateData)
	if err != nil {
		http.Error(w, `{"error": "`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "success"})
}

// Получить список пользователей
// GET /api/admin/users?page=1&limit=20&role=student&status=active&search=email
func (h *AdminHandler) GetUsers(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	// Параметры запроса
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	if page < 1 {
		page = 1
	}

	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	if limit < 1 || limit > 100 {
		limit = 20
	}

	// Фильтры
	filters := map[string]string{
		"role":   r.URL.Query().Get("role"),
		"status": r.URL.Query().Get("status"),
		"search": r.URL.Query().Get("search"),
	}

	users, total, err := h.adminService.GetUsers(ctx, filters, page, limit)
	if err != nil {
		http.Error(w, `{"error": "`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"users":       users,
		"page":        page,
		"limit":       limit,
		"total":       total,
		"total_pages": (total + limit - 1) / limit,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Получить пользователя по ID
// GET /api/admin/users/{id}
func (h *AdminHandler) GetUserByID(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.PathValue("id")
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		http.Error(w, `{"error": "Invalid user ID"}`, http.StatusBadRequest)
		return
	}

	ctx := r.Context()

	user, err := h.adminService.GetUserByID(ctx, userID)
	if err != nil {
		http.Error(w, `{"error": "User not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// Изменить роль пользователя
// PATCH /api/admin/users/{id}/role
func (h *AdminHandler) ChangeUserRole(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.PathValue("id")
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		http.Error(w, `{"error": "Invalid user ID"}`, http.StatusBadRequest)
		return
	}

	var request struct {
		Role string `json:"role"`
	}
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	ctx := r.Context()

	err = h.adminService.ChangeUserRole(ctx, userID, request.Role)
	if err != nil {
		http.Error(w, `{"error": "`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "success"})
}

// Изменить статус пользователя
// PATCH /api/admin/users/{id}/status
func (h *AdminHandler) ChangeUserStatus(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.PathValue("id")
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		http.Error(w, `{"error": "Invalid user ID"}`, http.StatusBadRequest)
		return
	}

	var request struct {
		Status string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	ctx := r.Context()

	err = h.adminService.ChangeUserStatus(ctx, userID, request.Status)
	if err != nil {
		http.Error(w, `{"error": "`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "success"})
}
