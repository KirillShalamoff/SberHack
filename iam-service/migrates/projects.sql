CREATE TABLE projects(
    project_id INT AUTO_INCREMENT PRIMARY KEY, #UUID
    title VARCHAR(100),
    descriptn VARCHAR(500),
    difficulty VARCHAR(100),
    diploma BOOLEAN,
    scientific_novelty VARCHAR(500)
);