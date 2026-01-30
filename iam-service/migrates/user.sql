CREATE TABLE users(
    user_id INT PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    password_hash INT,
    name_ VARCHAR(100),
    group VARCHAR(100),
    trained_level VARCHAR(100),
    skills VARCHAR(100),
    role_ VARCHAR(100),
    project_id INT UNIQUE
);