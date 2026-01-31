// src/interface/types.ts
export interface ProjectCardProps {
  // Основные поля
  id: string | number;
  title: string;
  description: string;

  // Новые поля из БД (сделаем их опциональными)
  keyTasks?: string[]; // Ключевые задачи
  value?: string; // Научная/практическая ценность
  tags: string[]; // Требуемые навыки
  curriculumConnection?: string; // Связь с учебной программой
  difficulty: number; // Сложность по 5-балльной
  diploma?: boolean; // Можно ли для диплома
  scientificNovelty?: string; // Научная новизна
  duration: string; // Срок

  // Ментор
  mentor: {
    id: number;
    name: string;
    email?: string;
    position?: string;
    department?: string;
    avatar?: string;
  };

  // Статус и доступность
  status: "recruiting" | "in_progress" | "completed" | "archived";
  availableSlots?: number;
  maxParticipants?: number;
  startDate?: string;
  endDate?: string;

  // Callback функции
  onArchive?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onClick?: (id: string | number) => void;
  onApply?: (id: string | number) => void; // Для подачи заявки

  // Дополнительные
  createdAt?: string;
  updatedAt?: string;
  university?: string; // Для какого вуза проект
  category?: string[]; // Категории проекта
  prerequisites?: string; // Предварительные требования
}

// Базовые типы
export type Priority = "low" | "medium" | "high";
export type ColumnId = "todo" | "in-progress" | "done" | string;

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
  labels?: string[];
  columnId: ColumnId;
  grade?: number;
}

export interface Column {
  id: ColumnId;
  title: string;
  tasks: Task[];
}

export interface KanbanBoardState {
  columns: Column[];
  tasks: Task[];
}

// DnD типы
export interface DragStartEvent {
  active: { id: string };
}

export interface DragEndEvent {
  active: { id: string };
  over: { id: string } | null;
}

// Пропсы компонентов
export interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export interface ColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask?: (columnId: ColumnId) => void;
  onEditTask?: (task: Task) => void; // Добавляем
  onDeleteTask?: (taskId: string) => void; // Добавляем
}

export interface KanbanBoardProps {
  initialData?: Column[];
  onTaskMove?: (
    taskId: string,
    fromColumn: ColumnId,
    toColumn: ColumnId,
  ) => void;
}
