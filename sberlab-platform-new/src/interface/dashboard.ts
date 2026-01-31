export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "critical";
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  dueDate?: string;
  tags: string[];
  projectId?: string;
  createdAt: string;
  updatedAt: string;
  estimatedHours?: number;
  spentHours?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "archived" | "completed";
  color: string;
  taskCount: number;
  completedTasks: number;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
  color: string;
  limit?: number;
  wipLimit?: number;
  description?: string;
  order: number;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  inProgressTasks: number;
  totalProjects: number;
  activeProjects: number;
  teamProductivity: number;
}

export interface FilterOptions {
  projectId?: string;
  assigneeId?: string;
  priority?: string[];
  status?: string[];
  dueDate?: {
    from?: string;
    to?: string;
  };
}
