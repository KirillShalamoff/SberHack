package config

import (
	"context"
	"github.com/Role1776/gigago"
	"os"
)

type GigaChatClient struct {
	Model *gigago.GenerativeModel
	Ctx   context.Context
}

func InitGigaChat() (*GigaChatClient, error) {
	ctx := context.Background()

	apiKey := os.Getenv("GIGACHAT_KEY")
	client, err := gigago.NewClient(
		ctx,
		apiKey,
		gigago.WithCustomInsecureSkipVerify(true),
	)
	if err != nil {
		return nil, err
	}

	model := client.GenerativeModel("GigaChat")
	model.Temperature = 0.5
	model.SystemInstruction = `
Ты — рекомендательная система для образовательной платформы СберЛаб-НГУ.
Ты подбираешь подходящие проекты и объясняешь выбор.
`

	return &GigaChatClient{
		Model: model,
		Ctx:   ctx,
	}, nil
}
