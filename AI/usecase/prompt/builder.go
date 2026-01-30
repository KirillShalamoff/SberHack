package prompt

import (
	"fmt"
	"strings"
)

type RecommendDTO struct {
	Role        string         `json:"role"`
	Skills      []string       `json:"skills"`
	Level       string         `json:"level"`
	Preferences map[string]any `json:"preferences"`
	Projects    []Project      `json:"projects"`
}

type Project struct {
	ID          int      `json:"id"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Skills      []string `json:"required_skills"`
	Difficulty  string   `json:"difficulty"`
	Diploma     bool     `json:"diploma"`
}

func Build(dto RecommendDTO) string {
	var b strings.Builder

	b.WriteString("Анкета участника:\n")
	b.WriteString(fmt.Sprintf("Роль: %s\n", dto.Role))
	b.WriteString(fmt.Sprintf("Уровень: %s\n", dto.Level))
	b.WriteString(fmt.Sprintf("Навыки: %s\n\n", strings.Join(dto.Skills, ", ")))

	b.WriteString("Список проектов:\n")
	for _, p := range dto.Projects {
		b.WriteString(fmt.Sprintf(
			"%d) %s\nОписание: %s\nНавыки: %s\nСложность: %s\nДиплом: %v\n\n",
			p.ID,
			p.Title,
			p.Description,
			strings.Join(p.Skills, ", "),
			p.Difficulty,
			p.Diploma,
		))
	}

	b.WriteString(`
Задача:
Выбери до 3 наиболее подходящих проектов.
Отсортируй по убыванию релевантности.
Для каждого проекта напиши краткое объяснение.
`)

	return b.String()
}
