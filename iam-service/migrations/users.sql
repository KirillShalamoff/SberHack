CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    group_name VARCHAR(100),
    trained_level VARCHAR(100),
    skills TEXT,          -- для MVP можно строкой "Go,SQL,ML"
    role VARCHAR(20) NOT NULL DEFAULT 'student'
);
