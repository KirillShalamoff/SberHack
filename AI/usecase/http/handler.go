package http

import (
	"encoding/json"
	"hachanot/usecase/gigachat"
	"hachanot/usecase/prompt"
	"hachanot/usecase/service"
	"net/http"
)

var limiter = make(chan struct{}, 10)

func Recommend(ai *gigachat.Client) http.Handler {
	svc := service.New(ai)

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		select {
		case limiter <- struct{}{}:
			defer func() { <-limiter }()
		default:
			http.Error(w, "AI busy", http.StatusTooManyRequests)
			return
		}

		var dto prompt.RecommendDTO
		if err := json.NewDecoder(r.Body).Decode(&dto); err != nil {
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}

		result, err := svc.Recommend(dto)
		if err != nil {
			http.Error(w, "AI error", http.StatusInternalServerError)
			return
		}

		w.Write([]byte(result))
	})
}
