import React, { useState, useEffect } from "react";
import { Task, Priority, ColumnId } from "../../interface/types";
import { priorityColors, columnColors } from "../../mocks/initialData";
import Button from "../ui/button/button";
import s from "../styles/kanban/taskModal.module.css";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  initialData?: Partial<Task>;
  mode: "create" | "edit";
  columnId?: ColumnId;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  columnId,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as Priority,
    assignee: "Я",
    columnId: columnId || "todo",
    labels: [] as string[],
  });

  const [customLabel, setCustomLabel] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const assignees = [
    "Я",
    "Алексей",
    "Мария",
    "Дмитрий",
    "Елена",
    "Не назначено",
  ];
  const additionalLabels = [
    "frontend",
    "backend",
    "design",
    "testing",
    "documentation",
    "bug",
    "feature",
    "urgent",
  ];

  // Инициализация формы
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        priority: initialData.priority || "medium",
        assignee: initialData.assignee || "Я",
        columnId: initialData.columnId || columnId || "todo",
        labels: initialData.labels || [],
      });
    } else if (mode === "create") {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        assignee: "Я",
        columnId: columnId || "todo",
        labels: [],
      });
    }
  }, [initialData, mode, columnId]);

  // Валидация
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Название задачи обязательно";
    } else if (formData.title.length > 100) {
      newErrors.title = "Название не должно превышать 100 символов";
    }

    if (formData.description.length > 1000) {
      newErrors.description = "Описание не должно превышать 1000 символов";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработка отправки
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      assignee: formData.assignee,
      columnId: formData.columnId,
      labels: formData.labels,
    };

    onSubmit(taskData);
    onClose();
  };

  // Обработка изменений
  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Работа с метками
  const handleAddLabel = (label: string) => {
    if (label.trim() && !formData.labels.includes(label.trim())) {
      handleChange("labels", [...formData.labels, label.trim()]);
    }
  };

  const handleRemoveLabel = (labelToRemove: string) => {
    handleChange(
      "labels",
      formData.labels.filter((label) => label !== labelToRemove),
    );
  };

  const handleAddCustomLabel = () => {
    if (customLabel.trim()) {
      handleAddLabel(customLabel.trim());
      setCustomLabel("");
    }
  };

  // Закрытие по ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Блокировка скролла
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={s.modalOverlay} onClick={onClose}>
      <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={s.modalHeader}>
          <h2>
            {mode === "create"
              ? "➕ Создать задачу"
              : "✏️ Редактировать задачу"}
          </h2>
          <Button
            variant="activeGray"
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className={s.modalCloseBtn}
          >
            ✕
          </Button>
        </div>

        <form onSubmit={handleSubmit} className={s.modalForm}>
          {/* Название задачи */}
          <div className={s.formGroup}>
            <label htmlFor="title" className={s.formLabel}>
              Название задачи *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Введите название задачи..."
              className={
                errors.title
                  ? `${s.formInput} ${s.formInputError}`
                  : s.formInput
              }
              autoFocus
              maxLength={100}
            />
            {errors.title && (
              <span className={s.errorMessage}>{errors.title}</span>
            )}
            <div className={s.charCounter}>
              {formData.title.length}/100 символов
            </div>
          </div>

          {/* Описание */}
          <div className={s.formGroup}>
            <label htmlFor="description" className={s.formLabel}>
              Описание
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Опишите задачу подробнее..."
              className={
                errors.description
                  ? `${s.formTextarea} ${s.formTextareaError}`
                  : s.formTextarea
              }
              rows={4}
              maxLength={1000}
            />
            {errors.description && (
              <span className={s.errorMessage}>{errors.description}</span>
            )}
            <div className={s.charCounter}>
              {formData.description.length}/1000 символов
            </div>
          </div>

          {/* Приоритет и исполнитель */}
          <div className={s.formRow}>
            <div className={s.formGroup}>
              <label htmlFor="priority" className={s.formLabel}>
                Приоритет
              </label>
              <div className={s.priorityButtons}>
                {(["low", "medium", "high"] as Priority[]).map((priority) => (
                  <Button
                    key={priority}
                    type="button"
                    variant={
                      formData.priority === priority ? "primary" : "secondary"
                    }
                    className={
                      formData.priority === priority
                        ? `${s.priorityBtn} ${s.priorityBtnActive}`
                        : s.priorityBtn
                    }
                    style={
                      formData.priority === priority
                        ? {
                            backgroundColor: priorityColors[priority],
                            borderColor: priorityColors[priority],
                          }
                        : undefined
                    }
                    onClick={() => handleChange("priority", priority)}
                  >
                    {priority === "low" && "🔽 Низкий"}
                    {priority === "medium" && "🔼 Средний"}
                    {priority === "high" && "🔥 Высокий"}
                  </Button>
                ))}
              </div>
            </div>

            <div className={s.formGroup}>
              <label htmlFor="assignee" className={s.formLabel}>
                Исполнитель
              </label>
              <div className={s.assigneeSelect}>
                <select
                  id="assignee"
                  value={formData.assignee}
                  onChange={(e) => handleChange("assignee", e.target.value)}
                  className={s.formSelect}
                >
                  {assignees.map((person) => (
                    <option key={person} value={person}>
                      {person}
                    </option>
                  ))}
                </select>
                <div className={s.assigneeAvatar}>
                  {formData.assignee.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Колонка (только при создании) */}
          {mode === "create" && (
            <div className={s.formGroup}>
              <label htmlFor="column" className={s.formLabel}>
                Статус
              </label>
              <div className={s.columnButtons}>
                {["todo", "in-progress", "done"].map((colId) => (
                  <Button
                    key={colId}
                    type="button"
                    variant={
                      formData.columnId === colId ? "primary" : "secondary"
                    }
                    className={
                      formData.columnId === colId
                        ? `${s.columnBtn} ${s.columnBtnActive}`
                        : s.columnBtn
                    }
                    style={
                      formData.columnId === colId
                        ? {
                            backgroundColor: columnColors[colId],
                            borderColor: columnColors[colId],
                          }
                        : undefined
                    }
                    onClick={() => handleChange("columnId", colId)}
                  >
                    {colId === "todo" && "📝 К выполнению"}
                    {colId === "in-progress" && "⚡ В работе"}
                    {colId === "done" && "✅ Выполнено"}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Метки */}
          <div className={s.formGroup}>
            <label className={s.formLabel}>Метки</label>
            <div className={s.labelsSection}>
              <div className={s.selectedLabels}>
                {formData.labels.map((label) => (
                  <span key={label}>
                    {label}
                    <Button
                      type="button"
                      variant="activeGray"
                      onClick={() => handleRemoveLabel(label)}
                      className={s.labelRemove}
                      aria-label={`Удалить метку ${label}`}
                    >
                      ×
                    </Button>
                  </span>
                ))}
                {formData.labels.length === 0 && (
                  <span className={s.noLabels}>Метки не добавлены</span>
                )}
              </div>

              <div className={s.addLabelRow}>
                <input
                  type="text"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomLabel();
                    }
                  }}
                  placeholder="Введите новую метку..."
                  className={s.labelInput}
                  maxLength={20}
                />
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleAddCustomLabel}
                  disabled={!customLabel.trim()}
                  aria-label="Добавить метку"
                  className={s.labelAddBtn}
                >
                  +
                </Button>
              </div>

              <div className={s.quickLabels}>
                <p className={s.quickLabelsTitle}>Быстрый выбор:</p>
                <div className={s.quickLabelsGrid}>
                  {additionalLabels
                    .filter((label) => !formData.labels.includes(label))
                    .map((label) => (
                      <Button
                        key={label}
                        type="button"
                        variant="activeGray"
                        onClick={() => handleAddLabel(label)}
                        className={s.quickLabel}
                      >
                        {label}
                      </Button>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className={s.modalActions}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Отмена
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!formData.title.trim()}
            >
              {mode === "create" ? "Создать задачу" : "Сохранить изменения"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
