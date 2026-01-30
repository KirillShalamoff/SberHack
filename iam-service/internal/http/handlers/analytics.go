package handlers

import (
	"encoding/json"
	"iam-service/internal/service"
	"net/http"
)

type AnalyticsHandler struct {
	analyticsService *service.AnalyticsService
}

func NewAnalyticsHandler(analyticsService *service.AnalyticsService) *AnalyticsHandler {
	return &AnalyticsHandler{
		analyticsService: analyticsService,
	}
}

// GetDashboardStats - статистика для дашборда
// GET /api/admin/analytics/dashboard
func (h *AnalyticsHandler) GetDashboardStats(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	// Получаем статистику
	stats, err := h.analyticsService.GetDashboardStats(ctx)
	if err != nil {
		http.Error(w, `{"error": "Failed to get analytics"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}
