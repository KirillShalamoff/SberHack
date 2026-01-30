CREATE TABLE students_list (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    user_id INT NOT NULL UNIQUE
);