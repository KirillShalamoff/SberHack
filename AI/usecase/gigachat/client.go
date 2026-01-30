package gigachat

import (
	"context"
	"github.com/Role1776/gigago"
)

type Client struct {
	ctx    context.Context
	client *gigago.Client
	model  *gigago.GenerativeModel
}

func New(apiKey string) (*Client, error) {
	ctx := context.Background()

	c, err := gigago.NewClient(
		ctx,
		apiKey,
		gigago.WithCustomInsecureSkipVerify(true),
	)
	if err != nil {
		return nil, err
	}

	model := c.GenerativeModel("GigaChat")
	model.Temperature = 0.4
	model.SystemInstruction = `
Ты — рекомендательная система для образовательной платформы СберЛаб-НГУ.
Ты выбираешь подходящие проекты для участника и кратко объясняешь выбор.
Ты НЕ придумываешь проекты.
`
	return &Client{
		ctx:    ctx,
		client: c,
		model:  model,
	}, nil
}

func (c *Client) Generate(prompt string) (string, error) {
	resp, err := c.model.Generate(c.ctx, []gigago.Message{
		{Role: gigago.RoleUser, Content: prompt},
	})
	if err != nil {
		return "", err
	}

	return resp.Choices[0].Message.Content, nil
}

func (c *Client) Close() {
	c.client.Close()
}
