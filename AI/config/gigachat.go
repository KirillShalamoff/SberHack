package config

import (
	"hachanot/usecase/gigachat"
	"os"
)

func InitGigaChat() (*gigachat.Client, error) {
	apiKey := os.Getenv("GIGACHAT_KEY")
	return gigachat.New(apiKey)
}
