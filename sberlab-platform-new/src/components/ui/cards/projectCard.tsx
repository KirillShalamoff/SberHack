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
  const [isApplying, setIsApplying] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<
    "none" | "pending" | "success" | "error"
  >("none");
  const [applicationId, setApplicationId] = useState<string | null>(null);

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

  const handleApply = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isApplying) return; // Предотвращаем множественные нажатия

    setIsApplying(true);
    setApplicationStatus("pending");

    try {
      // Вызываем API для подачи заявки
      const response = await submitApplication(id);

      setApplicationId(response.application_id);
      setApplicationStatus("success");

      if (onApply) {
        onApply(id);
      }

      alert(
        `Заявка успешно подана!\nНомер заявки: ${response.application_id}\nСтатус: ${response.status === "pending" ? "На рассмотрении" : response.status}`,
      );

      setTimeout(() => {
        setApplicationStatus("none");
      }, 3000);
    } catch (error: any) {
      console.error("Ошибка при подаче заявки:", error);
      setApplicationStatus("error");

      if (
        error.message?.includes("409") ||
        error.message?.includes("already applied")
      ) {
        alert("Вы уже подали заявку на этот проект.");
      } else if (
        error.message?.includes("401") ||
        error.message?.includes("403")
      ) {
        alert("Для подачи заявки необходимо авторизоваться.");
        // Можно перенаправить на страницу логина
        // window.location.href = "/login";
      } else {
        alert("Не удалось подать заявку. Пожалуйста, попробуйте позже.");
      }

      // Сброс статуса через 3 секунды
      setTimeout(() => {
        setApplicationStatus("none");
      }, 3000);
    } finally {
      setIsApplying(false);
    }
  };

  const submitApplication = async (projectId: string | number) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      throw new Error("Требуется авторизация");
    }

    const response = await fetch(`/student/projects/${projectId}/apply`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Заявка на проект "${title}". Хочу участвовать!`,
      }),
    });

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error("Вы уже подали заявку на этот проект");
      } else if (response.status === 401) {
        throw new Error("Требуется авторизация");
      } else if (response.status === 403) {
        throw new Error("Нет прав на подачу заявки");
      } else {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }
    }

    return response.json();
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

  // Получение текста для кнопки в зависимости от статуса
  const getApplyButtonText = () => {
    if (isApplying) return "Отправка...";
    if (applicationStatus === "success") return "Заявка подана!";
    if (applicationStatus === "pending") return "Обработка...";
    if (applicationStatus === "error") return "Ошибка";
    return "Подать заявку";
  };

  // Получение варианта кнопки в зависимости от статуса
  const getApplyButtonVariant = () => {
    if (applicationStatus === "success") return "success" as any;
    if (applicationStatus === "error") return "danger" as any;
    if (isApplying || applicationStatus === "pending")
      return "secondary" as any;
    return "secondary" as any;
  };

  // Получение иконки для кнопки
  const getApplyButtonIcon = () => {
    if (applicationStatus === "success") return "check-circle";
    if (applicationStatus === "error") return "alert-circle";
    if (isApplying || applicationStatus === "pending") return "loader";
    return "send";
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
        {/* Контейнер для основного контента */}
        <div className={styles.cardContent}>
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
                <Button
                  variant={getApplyButtonVariant()}
                  onClick={handleApply}
                  disabled={isApplying || applicationStatus === "success"}
                  className={styles.applyButton}
                >
                  {getApplyButtonIcon() && (
                    <SvgIcon
                      name={getApplyButtonIcon()}
                      width={16}
                      height={16}
                      className={isApplying ? styles.spinningIcon : ""}
                    />
                  )}
                  {getApplyButtonText()}
                </Button>
              )}

              {/* Показываем ID заявки если заявка подана */}
              {applicationStatus === "success" && applicationId && (
                <div className={styles.applicationInfo}>
                  <small>Заявка #{applicationId.slice(0, 8)}...</small>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Бейдж статуса - теперь снаружи контента */}
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
        onApply={() => handleApply(new MouseEvent("click") as any)}
      />
    </>
  );
};
