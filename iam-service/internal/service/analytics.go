package service

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
)

type AnalyticsService struct {
	db *pgxpool.Pool
}

func NewAnalyticsService(db *pgxpool.Pool) *AnalyticsService {
	return &AnalyticsService{db: db}
}

// GetDashboardStats - собирает ВСЮ статистику для администратора
func (s *AnalyticsService) GetDashboardStats(ctx context.Context) (map[string]interface{}, error) {
	stats := make(map[string]interface{})

	// 1. Общее количество проектов
	var totalProjects, activeProjects, completedProjects int

	err := s.db.QueryRow(ctx, "SELECT COUNT(*) FROM projects").Scan(&totalProjects)
	if err != nil {
		// Если таблицы еще нет, ставим 0
		totalProjects, activeProjects, completedProjects = 0, 0, 0
	} else {
		s.db.QueryRow(ctx,
			"SELECT COUNT(*) FROM projects WHERE status = 'active'").Scan(&activeProjects)
		s.db.QueryRow(ctx,
			"SELECT COUNT(*) FROM projects WHERE status = 'completed'").Scan(&completedProjects)
	}

	stats["projects_total"] = totalProjects
	stats["projects_active"] = activeProjects
	stats["projects_completed"] = completedProjects

	// 2. Общее количество команд
	var totalTeams, activeTeams, completedTeams int

	err = s.db.QueryRow(ctx, "SELECT COUNT(*) FROM teams").Scan(&totalTeams)
	if err != nil {
		totalTeams, activeTeams, completedTeams = 0, 0, 0
	} else {
		s.db.QueryRow(ctx,
			"SELECT COUNT(*) FROM teams WHERE status = 'active'").Scan(&activeTeams)
		s.db.QueryRow(ctx,
			"SELECT COUNT(*) FROM teams WHERE status = 'completed'").Scan(&completedTeams)
	}

	stats["teams_total"] = totalTeams
	stats["teams_active"] = activeTeams
	stats["teams_completed"] = completedTeams

	// 3. Успешные завершения (команды с оценкой > 70)
	var successfulTeams int
	s.db.QueryRow(ctx, `
		SELECT COUNT(*) FROM teams 
		WHERE status = 'completed' AND score >= 70`).Scan(&successfulTeams)
	stats["successful_teams"] = successfulTeams

	// 4. Задействованные студенты (в активных командах)
	var activeStudents int
	s.db.QueryRow(ctx, `
		SELECT COUNT(DISTINCT tm.user_id)
		FROM team_members tm
		JOIN users u ON tm.user_id = u.user_id
		JOIN teams t ON tm.team_id = t.team_id
		WHERE u.role = 'student' AND t.status = 'active'`).Scan(&activeStudents)
	stats["active_students"] = activeStudents

	// 5. Задействованные кураторы (менторы активных проектов)
	var activeCurators int
	s.db.QueryRow(ctx, `
		SELECT COUNT(DISTINCT u.user_id)
		FROM projects p
		JOIN users u ON p.mentor_id = u.user_id
		WHERE p.status = 'active' AND u.role = 'curator'`).Scan(&activeCurators)
	stats["active_curators"] = activeCurators

	// 6. Средний балл команд (только завершенных)
	var avgScore float64
	s.db.QueryRow(ctx, `
		SELECT COALESCE(AVG(score), 0) 
		FROM teams 
		WHERE status = 'completed' AND score IS NOT NULL`).Scan(&avgScore)
	stats["average_score"] = avgScore

	// 7. Распределение пользователей по ролям
	rows, _ := s.db.Query(ctx, `
		SELECT role, COUNT(*) as count 
		FROM users 
		WHERE status != 'deleted'
		GROUP BY role ORDER BY count DESC`)

	if rows != nil {
		defer rows.Close()

		usersByRole := make(map[string]int)
		for rows.Next() {
			var role string
			var count int
			rows.Scan(&role, &count)
			usersByRole[role] = count
		}
		stats["users_by_role"] = usersByRole
	}

	// 8. Топ-5 проектов по количеству команд
	rows, _ = s.db.Query(ctx, `
		SELECT p.name, COUNT(t.team_id) as team_count
		FROM projects p
		LEFT JOIN teams t ON p.project_id = t.project_id
		GROUP BY p.project_id, p.name
		ORDER BY team_count DESC
		LIMIT 5`)

	if rows != nil {
		defer rows.Close()

		var topProjects []map[string]interface{}
		for rows.Next() {
			var name string
			var count int
			rows.Scan(&name, &count)
			topProjects = append(topProjects, map[string]interface{}{
				"project_name": name,
				"team_count":   count,
			})
		}
		stats["top_projects"] = topProjects
	}

	return stats, nil
}
