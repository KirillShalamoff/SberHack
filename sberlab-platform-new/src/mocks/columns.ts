import { Column } from "../interface/dashboard";

export const mockColumns: Column[] = [
  {
    id: "todo",
    title: "К выполнению",
    taskIds: ["3", "4", "7"],
    color: "#6B7280",
    limit: 10,
    order: 1,
    description: "Задачи, ожидающие начала работы",
  },
  {
    id: "in_progress",
    title: "В работе",
    taskIds: ["1", "5", "8"],
    color: "#3B82F6",
    limit: 5, // WIP лимит - не более 5 задач одновременно
    order: 2,
    description: "Задачи в активной разработке",
  },
  {
    id: "review",
    title: "На проверке",
    taskIds: ["6", "9"],
    color: "#F59E0B",
    limit: 8,
    order: 3,
    description: "Задачи на code review или тестирование",
  },
  {
    id: "done",
    title: "Выполнено",
    taskIds: ["2", "10"],
    color: "#10B981",
    limit: undefined, // Без лимита
    order: 4,
    description: "Завершенные задачи",
  },
];
