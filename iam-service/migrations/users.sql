-- Таблица пользователей (без изменений)
CREATE TABLE users (
                       user_id SERIAL PRIMARY KEY,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       password_hash TEXT NOT NULL,
                       full_name VARCHAR(100) NOT NULL,
                       group_name VARCHAR(100),
                       trained_level VARCHAR(100),
                       skills TEXT,
                       role VARCHAR(20) NOT NULL DEFAULT 'student',
                       status VARCHAR(20) NOT NULL DEFAULT 'active'
);

CREATE TABLE projects (
                          project_id SERIAL PRIMARY KEY,
                          name VARCHAR(200) NOT NULL,
                          description TEXT,
                          mentor_id INTEGER REFERENCES users(user_id),
                          status VARCHAR(20) DEFAULT 'active', -- active, completed, cancelled
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица команд (минимальная)
CREATE TABLE teams (
                       team_id SERIAL PRIMARY KEY,
                       project_id INTEGER NOT NULL REFERENCES projects(project_id),
                       name VARCHAR(100) NOT NULL,
                       status VARCHAR(20) DEFAULT 'active', -- active, completed
                       completed_at TIMESTAMP,
                       score INTEGER CHECK (score >= 0 AND score <= 100) -- финальная оценка 0-100
);

-- Участники команд (только связь)
CREATE TABLE team_members (
                              team_id INTEGER NOT NULL REFERENCES teams(team_id),
                              user_id INTEGER NOT NULL REFERENCES users(user_id),
                              PRIMARY KEY (team_id, user_id)
);

-- Индексы
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_teams_status ON teams(status);
CREATE INDEX idx_teams_project ON teams(project_id);