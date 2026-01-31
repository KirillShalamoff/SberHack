import { Column, Priority } from "../interface/types";

export const initialColumns: Column[] = [
  {
    id: "todo",
    title: "📝 To Do",
    tasks: [
      {
        id: "1",
        title: "Создать дашборд",
        description: "Разработать канбан-доску на React + TypeScript",
        assignee: "Я",
        priority: "high" as Priority,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
        columnId: "todo",
        labels: ["frontend", "react", "typescript"],
      },
      {
        id: "2",
        title: "Добавить TypeScript типы",
        description: "Типизировать все компоненты и утилиты",
        assignee: "Я",
        priority: "medium" as Priority,
        createdAt: new Date("2024-01-16"),
        updatedAt: new Date("2024-01-16"),
        columnId: "todo",
        labels: ["typescript", "refactoring"],
      },
      {
        id: "3",
        title: "Настроить ESLint",
        description: "Конфигурация линтера для проекта",
        assignee: "Коллега 1",
        priority: "low" as Priority,
        createdAt: new Date("2024-01-14"),
        updatedAt: new Date("2024-01-14"),
        columnId: "todo",
        labels: ["tooling"],
      },
    ],
  },
  {
    id: "in-progress",
    title: "⚡ In Progress",
    tasks: [
      {
        id: "4",
        title: "Реализовать drag-and-drop",
        description: "Интеграция dnd-kit с анимациями",
        assignee: "Я",
        priority: "high" as Priority,
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-17"),
        columnId: "in-progress",
        labels: ["dnd", "ui", "animation"],
      },
      {
        id: "5",
        title: "Стилизовать компоненты",
        description: "Адаптивный дизайн в стиле Сбера",
        assignee: "Дизайнер",
        priority: "medium" as Priority,
        createdAt: new Date("2024-01-12"),
        updatedAt: new Date("2024-01-16"),
        columnId: "in-progress",
        labels: ["css", "design", "responsive"],
      },
    ],
  },
  {
    id: "done",
    title: "✅ Done",
    tasks: [
      {
        id: "6",
        title: "Создать проект",
        description: "Инициализация React + TypeScript приложения",
        assignee: "Я",
        priority: "low" as Priority,
        createdAt: new Date("2024-01-05"),
        updatedAt: new Date("2024-01-08"),
        columnId: "done",
        labels: ["setup", "initialization"],
      },
      {
        id: "7",
        title: "Установить зависимости",
        description: "dnd-kit, nanoid и другие библиотеки",
        assignee: "Я",
        priority: "low" as Priority,
        createdAt: new Date("2024-01-06"),
        updatedAt: new Date("2024-01-07"),
        columnId: "done",
        labels: ["dependencies", "npm"],
      },
    ],
  },
];

export const priorityColors: Record<Priority, string> = {
  high: "var(--color-priority-high)",
  medium: "var(--color-priority-medium)",
  low: "var(--color-priority-low)",
};

export const columnColors: Record<string, string> = {
  todo: "var(--color-column-todo)",
  "in-progress": "var(--color-column-in-progress)",
  done: "var(--color-column-done)",
};

export const getPriorityLabel = (priority: Priority): string => {
  switch (priority) {
    case "high":
      return "Высокий";
    case "medium":
      return "Средний";
    case "low":
      return "Низкий";
    default:
      return priority;
  }
};
