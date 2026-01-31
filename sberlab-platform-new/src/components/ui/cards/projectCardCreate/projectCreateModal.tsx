import React, { useState } from "react";
import styles from "./projectDetailsModal.module.css";
import { ProjectCardProps } from "../../../../interface/types";
import { SvgIcon } from "../../SvgIcon/SvgIcon";
import { Tag } from "../../tag/tag";
import Button from "../../button/button";

interface ProjectCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (project: Omit<ProjectCardProps, "id">) => void;
  onGenerateDescription?: (
    projectData: Partial<Omit<ProjectCardProps, "id">>,
  ) => Promise<string>;
}

// Создаем расширенный тип с дополнительными полями, которые нужны для формы
type ProjectFormData = Omit<ProjectCardProps, "id"> & {
  status?: "recruiting" | "in_progress" | "completed" | "archived";
  availableSlots?: number;
  startDate?: string;
  endDate?: string;
};

export const ProjectCreateModal: React.FC<ProjectCreateModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onGenerateDescription,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newTask, setNewTask] = useState("");

  // Инициализируем с гарантированными значениями
  const [projectData, setProjectData] = useState<ProjectFormData>({
    title: "",
    description: "",
    tags: ["Python", "React"],
    difficulty: 3,
    duration: "6 месяцев",
    status: "recruiting",
    mentor: {
      id: 0,
      name: "",
      avatar: undefined,
    },
    availableSlots: 3,
    keyTasks: ["Изучить технологии проекта", "Разработать MVP"],
    value: "",
    curriculumConnection: "",
    diploma: false,
    scientificNovelty: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });

  if (!isOpen) return null;

  // Функция для рендера звезд сложности
  const renderStars = (
    rating: number,
    editable = false,
    onChange?: (rating: number) => void,
  ) => {
    return (
      <div className={styles.stars}>
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.starButton} ${editable ? styles.editableStar : ""}`}
            onClick={() => editable && onChange && onChange(i + 1)}
            disabled={!editable}
          >
            <SvgIcon
              name={i < rating ? "star-filled" : "star-empty"}
              className={`${styles.star} ${i < rating ? styles.filled : styles.empty}`}
              width={18}
              height={18}
            />
          </button>
        ))}
      </div>
    );
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (
        projectData.title ||
        projectData.description ||
        projectData.tags.length > 0 ||
        (projectData.keyTasks && projectData.keyTasks.length > 0)
      ) {
        if (
          window.confirm(
            "У вас есть несохраненные изменения. Закрыть без сохранения?",
          )
        ) {
          onClose();
        }
      } else {
        onClose();
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMentorChange = (field: string, value: string) => {
    setProjectData((prev) => ({
      ...prev,
      mentor: {
        ...prev.mentor,
        [field]: value,
      },
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !projectData.tags.includes(newTag.trim())) {
      setProjectData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setProjectData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddTask = () => {
    if (
      newTask.trim() &&
      projectData.keyTasks &&
      !projectData.keyTasks.includes(newTask.trim())
    ) {
      setProjectData((prev) => ({
        ...prev,
        keyTasks: [...(prev.keyTasks || []), newTask.trim()],
      }));
      setNewTask("");
    }
  };

  const handleRemoveTask = (taskToRemove: string) => {
    setProjectData((prev) => ({
      ...prev,
      keyTasks: prev.keyTasks?.filter((task) => task !== taskToRemove) || [],
    }));
  };

  const handleDifficultyChange = (rating: number) => {
    setProjectData((prev) => ({
      ...prev,
      difficulty: rating,
    }));
  };

  const handleDiplomaChange = (diploma: boolean) => {
    setProjectData((prev) => ({
      ...prev,
      diploma,
    }));
  };

  const handleStatusChange = (status: ProjectFormData["status"]) => {
    setProjectData((prev) => ({
      ...prev,
      status,
    }));
  };

  const handleCreate = () => {
    if (!projectData.title.trim()) {
      alert("Пожалуйста, укажите название проекта");
      return;
    }

    if (!projectData.description.trim()) {
      alert("Пожалуйста, добавьте описание проекта");
      return;
    }

    if (!projectData.mentor.name.trim()) {
      alert("Пожалуйста, укажите имя руководителя проекта");
      return;
    }

    if (onCreate) {
      // Преобразуем ProjectFormData обратно в ProjectCardProps (без дополнительных полей)
      const projectToCreate: Omit<ProjectCardProps, "id"> = {
        title: projectData.title,
        description: projectData.description,
        tags: projectData.tags,
        difficulty: projectData.difficulty,
        duration: projectData.duration,
        mentor: projectData.mentor,
        keyTasks: projectData.keyTasks,
        value: projectData.value,
        curriculumConnection: projectData.curriculumConnection,
        diploma: projectData.diploma,
        scientificNovelty: projectData.scientificNovelty,
      };

      onCreate(projectToCreate);

      // Сброс формы
      setProjectData({
        title: "",
        description: "",
        tags: ["Python", "React"],
        difficulty: 3,
        duration: "6 месяцев",
        status: "recruiting",
        mentor: {
          id: 0,
          name: "",
          avatar: undefined,
        },
        availableSlots: 3,
        keyTasks: ["Изучить технологии проекта", "Разработать MVP"],
        value: "",
        curriculumConnection: "",
        diploma: false,
        scientificNovelty: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      });
    }
  };

  const handleGenerateDescription = async () => {
    if (!onGenerateDescription) return;

    setIsGenerating(true);
    try {
      // Отправляем данные проекта для генерации описания
      const generatedDescription = await onGenerateDescription(projectData);
      setProjectData((prev) => ({
        ...prev,
        description: generatedDescription,
      }));
    } catch (error) {
      console.error("Ошибка генерации описания:", error);
      alert("Не удалось сгенерировать описание. Пожалуйста, попробуйте позже.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Заголовок и кнопка закрытия */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Создание нового проекта</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <SvgIcon name="x" width={20} height={20} />
          </button>
        </div>

        <div className={styles.modalContent}>
          {/* Основная информация */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Основная информация</h3>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Название проекта *
                <input
                  type="text"
                  name="title"
                  value={projectData.title}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="Введите название проекта"
                  required
                />
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Описание проекта *
                <div className={styles.descriptionGroup}>
                  <textarea
                    name="description"
                    value={projectData.description}
                    onChange={handleInputChange}
                    className={styles.formTextarea}
                    placeholder="Опишите проект..."
                    rows={4}
                    required
                  />
                  {onGenerateDescription && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleGenerateDescription}
                      disabled={isGenerating}
                      className={styles.generateButton}
                    >
                      <SvgIcon
                        name={isGenerating ? "loader" : "sparkles"}
                        width={14}
                        height={14}
                      />
                      {isGenerating ? "Генерация..." : "Сгенерировать ИИ"}
                    </Button>
                  )}
                </div>
              </label>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Срок проекта
                  <input
                    type="text"
                    name="duration"
                    value={projectData.duration}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Например: 6 месяцев"
                  />
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Свободных мест
                  <input
                    type="number"
                    name="availableSlots"
                    value={projectData.availableSlots || 3}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="3"
                    min="1"
                    max="20"
                  />
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Статус проекта
                  <select
                    name="status"
                    value={projectData.status || "recruiting"}
                    onChange={(e) =>
                      handleStatusChange(
                        e.target.value as ProjectFormData["status"],
                      )
                    }
                    className={styles.formSelect}
                  >
                    <option value="recruiting">Идет набор</option>
                    <option value="in_progress">В работе</option>
                    <option value="completed">Завершен</option>
                    <option value="archived">Архивирован</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          {/* Требуемые навыки */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Требуемые навыки</h3>

            <div className={styles.editTags}>
              <div className={styles.tagsEdit}>
                {projectData.tags.map((tag, index) => (
                  <div key={index} className={styles.tagItemEdit}>
                    <Tag variant="tech">{tag}</Tag>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className={styles.removeButton}
                    >
                      <SvgIcon name="x" width={12} height={12} />
                    </button>
                  </div>
                ))}
              </div>
              <div className={styles.addTagInput}>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Новый навык"
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddTag}
                  className={styles.smallButton}
                >
                  Добавить
                </Button>
              </div>
            </div>
          </div>

          {/* Ключевые задачи */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Ключевые задачи</h3>

            <div className={styles.editTasks}>
              <div className={styles.tasksListEdit}>
                {projectData.keyTasks?.map((task, index) => (
                  <div key={index} className={styles.taskItemEdit}>
                    <span>{task}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTask(task)}
                      className={styles.removeButton}
                    >
                      <SvgIcon name="x" width={12} height={12} />
                    </button>
                  </div>
                )) || []}
              </div>
              <div className={styles.addTaskInput}>
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Новая задача"
                  onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddTask}
                  className={styles.smallButton}
                >
                  Добавить
                </Button>
              </div>
            </div>
          </div>

          {/* Дополнительная информация */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Дополнительная информация</h3>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Научная/практическая ценность
                <textarea
                  name="value"
                  value={projectData.value || ""}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  placeholder="Опишите ценность проекта..."
                  rows={3}
                />
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Научная новизна
                <textarea
                  name="scientificNovelty"
                  value={projectData.scientificNovelty || ""}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  placeholder="Опишите научную новизну..."
                  rows={3}
                />
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Связь с учебной программой
                <textarea
                  name="curriculumConnection"
                  value={projectData.curriculumConnection || ""}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  placeholder="Опишите связь с учебной программой..."
                  rows={3}
                />
              </label>
            </div>
          </div>

          {/* Сложность и диплом */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Сложность и диплом</h3>

            <div className={styles.difficultySection}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Сложность проекта</label>
                <div className={styles.starsContainer}>
                  {renderStars(
                    projectData.difficulty,
                    true,
                    handleDifficultyChange,
                  )}
                  <span className={styles.difficultyText}>
                    Уровень: {projectData.difficulty === 1 && "Начальный"}
                    {projectData.difficulty === 2 && "Простой"}
                    {projectData.difficulty === 3 && "Средний"}
                    {projectData.difficulty === 4 && "Сложный"}
                    {projectData.difficulty === 5 && "Экспертный"}
                  </span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Дипломный проект</label>
                <div className={styles.diplomaToggle}>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={projectData.diploma || false}
                      onChange={(e) => handleDiplomaChange(e.target.checked)}
                      className={styles.toggleInput}
                    />
                    <span className={styles.toggleSlider}></span>
                    <span className={styles.toggleText}>
                      {projectData.diploma
                        ? "Дипломный проект"
                        : "Не дипломный"}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Сроки проекта (опционально) */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Сроки проекта (опционально)</h3>
            <div className={styles.dateInputs}>
              <div className={styles.dateInput}>
                <label>Дата начала:</label>
                <input
                  type="date"
                  name="startDate"
                  value={projectData.startDate || ""}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.dateInput}>
                <label>Дата окончания:</label>
                <input
                  type="date"
                  name="endDate"
                  value={projectData.endDate || ""}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
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
              Руководитель проекта *
            </h3>

            <div className={styles.mentorForm}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Имя руководителя
                  <input
                    type="text"
                    value={projectData.mentor.name}
                    onChange={(e) => handleMentorChange("name", e.target.value)}
                    className={styles.formInput}
                    placeholder="Введите имя руководителя"
                    required
                  />
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Email руководителя
                  <input
                    type="email"
                    value={projectData.mentor.email || ""}
                    onChange={(e) =>
                      handleMentorChange("email", e.target.value)
                    }
                    className={styles.formInput}
                    placeholder="email@example.com"
                  />
                </label>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Должность
                    <input
                      type="text"
                      value={projectData.mentor.position || ""}
                      onChange={(e) =>
                        handleMentorChange("position", e.target.value)
                      }
                      className={styles.formInput}
                      placeholder="Например: Старший разработчик"
                    />
                  </label>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Кафедра/Отдел
                    <input
                      type="text"
                      value={projectData.mentor.department || ""}
                      onChange={(e) =>
                        handleMentorChange("department", e.target.value)
                      }
                      className={styles.formInput}
                      placeholder="Например: Кафедра информатики"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className={styles.modalActions}>
          <Button variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleCreate}>
            Создать проект
          </Button>
        </div>
      </div>
    </div>
  );
};
