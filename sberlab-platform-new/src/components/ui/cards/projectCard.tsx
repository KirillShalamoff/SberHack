import React, { useState } from "react";
import styles from "./projectCard.module.css";
import { Tag } from "../tag/tag";
import Button from "../button/button";
import { ProjectDetailsModal } from "./projectDetailsModal/projectDetailsModal";
import { ProjectCardProps } from "../../../interface/types";
import { SvgIcon } from "../SvgIcon/SvgIcon";

export const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  tags,
  difficulty,
  duration,
  status,
  mentor,
  availableSlots,
  onArchive,
  onDelete,
  onClick,
  keyTasks,
  value,
  curriculumConnection,
  diploma,
  scientificNovelty,
  startDate,
  endDate,
  onApply,
  ...rest
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    if (onClick) {
      onClick(id);
    } else {
      openModal();
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onApply) {
      onApply(id);
    }
  };

  const handleDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal();
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    onArchive && onArchive(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete && onDelete(id);
  };

  // Рендеринг звезд сложности
  const renderStars = () => {
    return (
      <div className={styles.difficulty}>
        <div className={styles.stars}>
          <span>Сложность: </span>
          {[...Array(5)].map((_, index) => (
            <SvgIcon
              key={index}
              name={index < difficulty ? "star-filled" : "star-empty"}
              className={`${styles.star} ${
                index < difficulty ? styles.filled : styles.empty
              }`}
              width={14}
              height={14}
            />
          ))}
        </div>
      </div>
    );
  };

  const getStatusColor = () => {
    switch (status) {
      case "recruiting":
        return "#10B981";
      case "in_progress":
        return "#3B82F6";
      case "completed":
        return "#6B7280";
      case "archived":
        return "#9CA3AF";
      default:
        return "#6B7280";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "recruiting":
        return "Идет набор";
      case "in_progress":
        return "В работе";
      case "completed":
        return "Завершен";
      case "archived":
        return "Архивирован";
      default:
        return status;
    }
  };

  return (
    <>
      <div
        className={styles.card}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleCardClick();
          }
        }}
      >
        {/* Заголовок и описание */}
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>

        {/* Теги технологий */}
        <div className={styles.tags}>
          {tags.map((tag, index) => (
            <Tag key={index} variant="tech">
              {tag}
            </Tag>
          ))}
        </div>

        {/* Информация о сложности и сроке */}
        <div className={styles.metaInfo}>
          {renderStars()}
          <div className={styles.duration}>
            <span>Длительность: {duration}</span>
          </div>
        </div>

        {/* Разделитель */}
        <div className={styles.divider} />

        {/* Нижняя часть с ментором и действиями */}
        <div className={styles.footer}>
          <div className={styles.mentorInfo}>
            <div className={styles.mentorAvatar}>
              <div className={styles.avatarPlaceholder}>
                <SvgIcon name="user" width={20} height={20} />
              </div>
            </div>
            <div className={styles.mentorDetails}>
              <span className={styles.mentorName}>{mentor.name}</span>
            </div>
            {diploma == true && (
              <div className={styles.slots}>
                <span className={styles.diplomaBadge}>Диплом</span>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            {/* Кнопка Подробнее - открывает модальное окно */}
            <Button variant="primary" onClick={handleDetails}>
              Подробнее
            </Button>

            {status === "recruiting" && (
              <Button variant="secondary" onClick={handleApply}>
                Подать заявку
              </Button>
            )}

            {/* Кнопки администратора
            <div className={styles.adminActions}>
              {onArchive && (
                <Button variant="secondary" onClick={handleArchive}>
                  Архивировать
                </Button>
              )}
              {onDelete && (
                <Button variant="primary" onClick={handleDelete}>
                  Удалить
                </Button>
              )}
            </div> */}
          </div>
        </div>

        {/* Бейдж статуса */}
        <div
          className={styles.statusBadge}
          style={{ backgroundColor: getStatusColor() }}
        >
          {getStatusText()}
        </div>
      </div>

      {/* Модальное окно с подробной информацией */}
      <ProjectDetailsModal
        project={{
          id,
          title,
          description,
          tags,
          difficulty,
          duration,
          status,
          mentor,
          availableSlots,
          keyTasks,
          value,
          curriculumConnection,
          diploma,
          scientificNovelty,
          startDate,
          endDate,
          ...rest,
        }}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onApply={() => onApply && onApply(id)}
      />
    </>
  );
};
