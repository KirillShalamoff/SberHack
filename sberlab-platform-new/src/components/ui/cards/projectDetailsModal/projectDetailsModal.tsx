import React from "react";
import styles from "./projectDetailsModal.module.css";
import { ProjectCardProps } from "../../../../interface/types";
import { SvgIcon } from "../../SvgIcon/SvgIcon";
import { Tag } from "../../tag/tag";
import Button from "../../button/button";

interface ProjectDetailsModalProps {
  project: ProjectCardProps;
  isOpen: boolean;
  onClose: () => void;
  onApply?: () => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  project,
  isOpen,
  onClose,
  onApply,
}) => {
  if (!isOpen) return null;

  // Функция для рендера звезд сложности
  const renderStars = (rating: number) => {
    return (
      <div className={styles.stars}>
        {[...Array(5)].map((_, i) => (
          <SvgIcon
            key={i}
            name={i < rating ? "star-filled" : "star-empty"}
            className={`${styles.star} ${i < rating ? styles.filled : styles.empty}`}
            width={18}
            height={18}
          />
        ))}
      </div>
    );
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Заголовок и кнопка закрытия */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{project.title}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <SvgIcon name="x" width={20} height={20} />
          </button>
        </div>

        <div className={styles.modalContent}>
          {/* Статус и основная информация */}
          <div className={styles.statusSection}>
            <div className={`${styles.statusBadge} ${styles[project.status]}`}>
              {project.status === "recruiting" && "Идет набор"}
              {project.status === "in_progress" && "В работе"}
              {project.status === "completed" && "Завершен"}
              {project.status === "archived" && "Архивирован"}
            </div>
            <div className={styles.metaInfo}>
              <div className={styles.metaItem}>
                <SvgIcon
                  name="calendar"
                  className={styles.metaIcon}
                  width={16}
                  height={16}
                />
                <span>Срок: {project.duration}</span>
              </div>
              {project.availableSlots && (
                <div className={styles.metaItem}>
                  <SvgIcon
                    name="users"
                    className={styles.metaIcon}
                    width={16}
                    height={16}
                  />
                  <span>Свободно мест: {project.availableSlots}</span>
                </div>
              )}
            </div>
          </div>

          {/* Описание проекта */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <SvgIcon
                name="book"
                className={styles.sectionIcon}
                width={18}
                height={18}
              />
              Описание проекта
            </h3>
            <p className={styles.sectionContent}>{project.description}</p>
          </div>

          {/* Ключевые задачи */}
          {project.keyTasks && project.keyTasks.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <SvgIcon
                  name="target"
                  className={styles.sectionIcon}
                  width={18}
                  height={18}
                />
                Ключевые задачи
              </h3>
              <ul className={styles.tasksList}>
                {project.keyTasks.map((task, index) => (
                  <li key={index} className={styles.taskItem}>
                    <SvgIcon
                      name="check-circle"
                      className={styles.taskIcon}
                      width={16}
                      height={16}
                    />
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Научная/практическая ценность */}
          {project.value && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <SvgIcon
                  name="award"
                  className={styles.sectionIcon}
                  width={18}
                  height={18}
                />
                Научная/практическая ценность
              </h3>
              <p className={styles.sectionContent}>{project.value}</p>
            </div>
          )}

          {/* Научная новизна */}
          {project.scientificNovelty && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <SvgIcon
                  name="star-filled"
                  className={styles.sectionIcon}
                  width={18}
                  height={18}
                />
                Научная новизна
              </h3>
              <p className={styles.sectionContent}>
                {project.scientificNovelty}
              </p>
            </div>
          )}

          {/* Требуемые навыки */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Требуемые навыки</h3>
            <div className={styles.tags}>
              {project.tags.map((tag, index) => (
                <Tag key={index} variant="tech">
                  {tag}
                </Tag>
              ))}
            </div>
          </div>

          {/* Связь с учебной программой */}
          {project.curriculumConnection && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                Связь с учебной программой
              </h3>
              <p className={styles.sectionContent}>
                {project.curriculumConnection}
              </p>
            </div>
          )}

          {/* Для диплома */}
          {project.diploma !== undefined && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Возможность выполнения</h3>
              <div className={styles.diplomaInfo}>
                <div
                  className={`${styles.diplomaBadge} ${project.diploma ? styles.allowed : styles.notAllowed}`}
                >
                  {project.diploma
                    ? "Можно использовать для диплома"
                    : "Не для диплома"}
                </div>
              </div>
            </div>
          )}

          {/* Сложность */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Сложность проекта</h3>
            <div className={styles.difficultySection}>
              {renderStars(project.difficulty)}
              <span className={styles.difficultyText}>
                Уровень: {project.difficulty === 1 && "Начальный"}
                {project.difficulty === 2 && "Простой"}
                {project.difficulty === 3 && "Средний"}
                {project.difficulty === 4 && "Сложный"}
                {project.difficulty === 5 && "Экспертный"}
              </span>
            </div>
          </div>

          {/* Информация о менторе */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <SvgIcon
                name="briefcase"
                className={styles.sectionIcon}
                width={18}
                height={18}
              />
              Руководитель проекта
            </h3>
            <div className={styles.mentorInfo}>
              <div className={styles.mentorAvatar}>
                {project.mentor.avatar ? (
                  <img src={project.mentor.avatar} alt={project.mentor.name} />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {project.mentor.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className={styles.mentorDetails}>
                <h4 className={styles.mentorName}>{project.mentor.name}</h4>
                {project.mentor.position && (
                  <p className={styles.mentorPosition}>
                    {project.mentor.position}
                  </p>
                )}
                {project.mentor.department && (
                  <p className={styles.mentorDepartment}>
                    {project.mentor.department}
                  </p>
                )}
                {project.mentor.email && (
                  <a
                    href={`mailto:${project.mentor.email}`}
                    className={styles.mentorEmail}
                  >
                    <SvgIcon
                      name="mail"
                      className={styles.emailIcon}
                      width={14}
                      height={14}
                    />
                    {project.mentor.email}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className={styles.modalActions}>
          <Button variant="secondary" onClick={onClose}>
            Закрыть
          </Button>

          {project.status === "recruiting" && onApply && (
            <Button variant="primary" onClick={onApply}>
              Подать заявку
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
