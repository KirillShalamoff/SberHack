import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, TaskCardProps } from "../../interface/types";
import { getPriorityLabel } from "../../mocks/initialData";
import Button from "../ui/button/button";
import s from "../styles/kanban/taskCard.module.css";

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Удалить задачу "${task.title}"?`)) {
      onDelete?.(task.id);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const cardPriorityClass =
    task.priority === "high"
      ? s.taskCardHigh
      : task.priority === "medium"
        ? s.taskCardMedium
        : s.taskCardLow;
  const priorityBadgeClass =
    task.priority === "high"
      ? s.taskPriorityHigh
      : task.priority === "medium"
        ? s.taskPriorityMedium
        : s.taskPriorityLow;

  const getLabelClass = (label: string) => {
    const key = (label.charAt(0).toUpperCase() + label.slice(1)) as
      | "Frontend"
      | "Backend"
      | "Bug"
      | "Feature";
    if (["Frontend", "Backend", "Bug", "Feature"].includes(key)) {
      return `${s.labelTag} ${s[`labelTag${key}` as keyof typeof s] || ""}`;
    }
    return s.labelTag;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${s.taskCard} ${cardPriorityClass}`}
      data-priority={task.priority}
      data-task-id={task.id}
    >
      <div className={s.taskHeader}>
        <span className={s.taskTitle}>{task.title}</span>
        <span className={`${s.taskPriority} ${priorityBadgeClass}`}>
          {getPriorityLabel(task.priority)}
        </span>
      </div>

      {task.description && (
        <p className={s.taskDescription}>{task.description}</p>
      )}

      <div className={s.taskMeta}>
        <span className={s.taskDate}>📅 {formatDate(task.createdAt)}</span>
        {task.createdAt.getTime() !== task.updatedAt.getTime() && (
          <span className={s.taskUpdated}>
            (обновлено: {formatDate(task.updatedAt)})
          </span>
        )}
      </div>

      <div className={s.taskFooter}>
        <div className={s.taskAssignee}>
          <div className={s.assigneeAvatar}>
            {task.assignee?.charAt(0).toUpperCase() || "?"}
          </div>
          <span>{task.assignee || "Не назначено"}</span>
        </div>

        <div className={s.taskActions}>
          <Button
            variant="activeGray"
            onClick={handleEdit}
            className={s.actionBtn}
            data-tooltip="Редактировать"
          >
            ✏️
          </Button>
          <Button
            variant="activeGray"
            onClick={handleDelete}
            className={s.actionBtn}
            data-tooltip="Удалить"
          >
            🗑️
          </Button>
        </div>
      </div>

      {task.labels && task.labels.length > 0 && (
        <div className={s.taskLabels}>
          {task.labels.map((label) => (
            <span key={label} className={getLabelClass(label)}>
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
