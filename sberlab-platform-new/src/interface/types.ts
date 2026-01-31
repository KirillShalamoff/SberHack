export interface ProjectCardProps {
  id: string | number;
  title: string;
  description: string;

  keyTasks?: string[];
  value?: string;
  tags: string[];
  curriculumConnection?: string;
  difficulty: number;
  diploma?: boolean;
  scientificNovelty?: string;
  duration: string;
  mentor: {
    id: number;
    name: string;
    email?: string;
    position?: string;
    department?: string;
    avatar?: string;
  };

  status: "recruiting" | "in_progress" | "completed" | "archived";
  availableSlots?: number;
  maxParticipants?: number;
  startDate?: string;
  endDate?: string;

  onArchive?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onClick?: (id: string | number) => void;
  onApply?: (id: string | number) => void;

  createdAt?: string;
  updatedAt?: string;
  university?: string;
  category?: string[];
  prerequisites?: string;
}

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

export interface DragStartEvent {
  active: { id: string };
}

export interface DragEndEvent {
  active: { id: string };
  over: { id: string } | null;
}

export interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export interface ColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask?: (columnId: ColumnId) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
}

export interface KanbanBoardProps {
  initialData?: Column[];
  onTaskMove?: (
    taskId: string,
    fromColumn: ColumnId,
    toColumn: ColumnId,
  ) => void;
}
