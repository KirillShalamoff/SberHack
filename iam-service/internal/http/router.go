package http

import (
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
