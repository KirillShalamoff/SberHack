package service

import (
	"hachanot/usecase/gigachat"
	"hachanot/usecase/prompt"
)

type Service struct {
	ai *gigachat.Client
}

func New(ai *gigachat.Client) *Service {
	return &Service{ai: ai}
}

func (s *Service) Recommend(dto prompt.RecommendDTO) (string, error) {
	p := prompt.Build(dto)
	return s.ai.Generate(p)
}
