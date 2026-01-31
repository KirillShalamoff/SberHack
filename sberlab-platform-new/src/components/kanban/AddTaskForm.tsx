import React, { useState } from "react";
import { ColumnId, Priority } from "../../interface/types";
import { priorityColors } from "../../mocks/initialData";
import Button from "../ui/button/button";
import s from "../styles/kanban/addTaskForm.module.css";

interface AddTaskFormProps {
  columnId: ColumnId;
  onSubmit: (taskData: {
    title: string;
    description: string;
    priority: Priority;
    assignee: string;
    labels: string[];
  }) => void;
  onCancel: () => void;
  assignees?: string[];
  defaultLabels?: string[];
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({
  columnId,
  onSubmit,
  onCancel,
  assignees = ["Я", "Коллега 1", "Коллега 2", "Не назначено"],
  defaultLabels = ["frontend", "backend", "bug", "feature", "urgent"],
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [assignee, setAssignee] = useState("Я");
  const [labels, setLabels] = useState<string[]>(["frontend"]);
  const [customLabel, setCustomLabel] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Введите название задачи");
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      assignee,
      labels,
    });

    // Сброс формы
    setTitle("");
    setDescription("");
    setPriority("medium");
    setAssignee("Я");
    setLabels(["frontend"]);
  };

  const handleAddLabel = () => {
    if (customLabel.trim() && !labels.includes(customLabel.trim())) {
      setLabels([...labels, customLabel.trim()]);
      setCustomLabel("");
    }
  };

  const handleRemoveLabel = (labelToRemove: string) => {
    setLabels(labels.filter((label) => label !== labelToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && customLabel.trim()) {
      handleAddLabel();
      e.preventDefault();
    }
  };

  return (
    <div className={s.addTaskFormOverlay}>
      <div className={s.addTaskForm}>
        <div className={s.formHeader}>
          <h3>➕ Новая задача</h3>
          <span className={s.columnBadge}>{columnId}</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={s.formGroup}>
            <label htmlFor="title">Название задачи *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Что нужно сделать?"
              autoFocus
              className={s.formInput}
            />
          </div>

          <div className={s.formGroup}>
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Подробное описание задачи..."
              rows={3}
              className={s.formTextarea}
            />
          </div>

          <div className={s.formRow}>
            <div className={s.formGroup}>
              <label htmlFor="priority">Приоритет</label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className={s.formSelect}
                style={{ borderLeftColor: priorityColors[priority] }}
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </select>
            </div>

            <div className={s.formGroup}>
              <label htmlFor="assignee">Исполнитель</label>
              <select
                id="assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className={s.formSelect}
              >
                {assignees.map((person) => (
                  <option key={person} value={person}>
                    {person}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={s.formGroup}>
            <label>Метки</label>
            <div className={s.labelsContainer}>
              <div className={s.selectedLabels}>
                {labels.map((label) => (
                  <span key={label}>
                    {label}
                    <Button
                      type="button"
                      variant="activeGray"
                      onClick={() => handleRemoveLabel(label)}
                      className={s.labelRemove}
                    >
                      ×
                    </Button>
                  </span>
                ))}
              </div>

              <div className={s.labelInputRow}>
                <input
                  type="text"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Добавить метку..."
                  className={s.labelInput}
                />
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleAddLabel}
                  disabled={!customLabel.trim()}
                  className={s.labelAddBtn}
                >
                  +
                </Button>
              </div>

              <div className={s.defaultLabels}>
                {defaultLabels
                  .filter((label) => !labels.includes(label))
                  .map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setLabels([...labels, label])}
                      className={s.defaultLabel}
                    >
                      {label}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          <div className={s.formActions}>
            <Button type="button" variant="secondary" onClick={onCancel}>
              Отмена
            </Button>
            <Button type="submit" variant="primary" disabled={!title.trim()}>
              Создать задачу
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskForm;
