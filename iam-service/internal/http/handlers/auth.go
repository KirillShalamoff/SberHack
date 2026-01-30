package handlers

import (
	"encoding/json"
	"net/http"

	"iam-service/internal/auth"
)

type AuthHandler struct {
	auth *auth.Service
}

func NewAuthHandler(a *auth.Service) *AuthHandler {
	return &AuthHandler{auth: a}
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	json.NewDecoder(r.Body).Decode(&req)

	access, refresh, err := h.auth.Login(r.Context(), req.Email, req.Password)
	if err != nil {
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"access_token":  access,
		"refresh_token": refresh,
	})
}
