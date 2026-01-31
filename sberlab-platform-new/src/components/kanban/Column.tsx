import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import { ColumnProps, Task } from "../../interface/types";
import Button from "../ui/button/button";
import s from "./column.module.css";

const Column: React.FC<ColumnProps> = ({
  column,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) => {
  const taskIds = tasks.map((task: Task) => task.id);

  const handleAddClick = () => {
    onAddTask?.(column.id);
  };

  const handleEditTaskWrapper = (task: Task) => {
    onEditTask?.(task);
  };

  const handleDeleteTaskWrapper = (taskId: string) => {
    onDeleteTask?.(taskId);
  };

  const columnVariant =
    column.id === "todo"
      ? s.columnTodo
      : column.id === "in-progress"
        ? s.columnInProgress
        : s.columnDone;

  return (
    <div className={`${s.column} ${columnVariant}`} data-column-id={column.id}>
      <div className={s.columnHeader}>
        <h3>{column.title}</h3>
        <div className={s.columnActions}>
          <span className={s.taskCount}>{tasks.length}</span>
        </div>
      </div>

      <div className={s.taskList}>
        {tasks.length === 0 ? (
          <div className={s.emptyState}>
            <div className={s.emptyStateIcon}>
              {column.id === "todo" && "📝"}
              {column.id === "in-progress" && "⚡"}
              {column.id === "done" && "✅"}
            </div>
            <h3>Нет задач</h3>
            <p>Нажмите кнопку ниже, чтобы добавить первую задачу</p>
          </div>
        ) : (
          <SortableContext
            items={taskIds}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTaskWrapper}
                onDelete={handleDeleteTaskWrapper}
              />
            ))}
          </SortableContext>
        )}
      </div>

      <Button
        variant="primary"
        onClick={handleAddClick}
        aria-label={`Добавить задачу в ${column.title}`}
        data-tooltip={`Добавить задачу в ${column.title}`}
        className={s.addTaskBtn}
      >
        + Добавить задачу
      </Button>
    </div>
  );
};

export default Column;
