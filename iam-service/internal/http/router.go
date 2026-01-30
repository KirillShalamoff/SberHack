package http

import (
	"encoding/json"
	"net/http"

	"iam-service/internal/auth"
	"iam-service/internal/config"
	"iam-service/internal/http/handlers"
	"iam-service/internal/storage"
)

func NewRouter(cfg config.Config, db *storage.DB) http.Handler {
	// 1) Репозитории (работа с БД)
	usersRepo := storage.NewUsersRepo(db.Pool)
	tokensRepo := storage.NewTokensRepo(db.Pool)

	// 2) JWT менеджер
	tokenMgr := auth.NewTokenManager(cfg.JWTSecret)

	// 3) Auth-сервис (бизнес-логика)
	authSvc := auth.NewService(usersRepo, tokensRepo, tokenMgr)

	// 4) Handlers (HTTP)
	h := handlers.NewAuthHandler(authSvc)

	mux := http.NewServeMux()

	// endpoints
	mux.HandleFunc("/auth/login", h.Login)

	// healthcheck
	mux.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	return mux
}

// FIXME смержить два route
func NewRouter2(
	adminHandler *handlers.AdminHandler,
	analyticsHandler *handlers.AnalyticsHandler,
) http.Handler {
	mux := http.NewServeMux()

	// Эндпоинты аналитики - ТОЛЬКО ДЛЯ АДМИНА
	mux.HandleFunc("GET /api/admin/analytics/dashboard", analyticsHandler.GetDashboardStats)

	// Эндпоинты управления пользователями - ТОЛЬКО ДЛЯ АДМИНА
	mux.HandleFunc("GET /api/admin/users", adminHandler.GetUsers)
	mux.HandleFunc("GET /api/admin/users/{id}", adminHandler.GetUserByID)
	mux.HandleFunc("PUT /api/admin/users/{id}", adminHandler.UpdateUser)
	mux.HandleFunc("PATCH /api/admin/users/{id}/role", adminHandler.ChangeUserRole)
	mux.HandleFunc("PATCH /api/admin/users/{id}/status", adminHandler.ChangeUserStatus)

	// Health check
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})

	return mux
}
