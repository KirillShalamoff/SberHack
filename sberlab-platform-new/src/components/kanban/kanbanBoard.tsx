import React, { useState, useCallback, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent as DndDragStartEvent,
  DragEndEvent as DndDragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import ColumnComponent from "./Column";
import TaskCard from "./TaskCard";
import Button from "../ui/button/button";
import {
  KanbanBoardProps,
  Column,
  Task,
  ColumnId,
} from "../../interface/types";
import { initialColumns } from "../../mocks/initialData";
import s from "../styles/kanban/kanbanBoard.module.css";
import TaskModal from "./taskModal";

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  initialData = initialColumns,
  onTaskMove,
}) => {
  const [columns, setColumns] = useState<Column[]>(initialData);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");

  // Состояния для модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [currentColumn, setCurrentColumn] = useState<ColumnId>("todo");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Получение задачи по ID
  const getTask = useCallback(
    (taskId: string): Task | undefined => {
      for (const column of columns) {
        const task = column.tasks.find((t) => t.id === taskId);
        if (task) return task;
      }
      return undefined;
    },
    [columns],
  );

  // Получение колонки по ID задачи
  const getTaskColumn = useCallback(
    (taskId: string): Column | undefined => {
      return columns.find((column) =>
        column.tasks.some((task) => task.id === taskId),
      );
    },
    [columns],
  );

  // Обработка начала перетаскивания
  const handleDragStart = useCallback(
    (event: DndDragStartEvent) => {
      const task = getTask(event.active.id as string);
      if (task) setActiveTask(task);
    },
    [getTask],
  );

  // Обработка завершения перетаскивания
  const handleDragEnd = useCallback(
    (event: DndDragEndEvent) => {
      const { active, over } = event;
      setActiveTask(null);

      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      const activeColumn = getTaskColumn(activeId);
      const overColumn =
        getTaskColumn(overId) || columns.find((col) => col.id === overId);

      if (!activeColumn || !overColumn) return;

      // Если задача перемещается в другую колонку
      if (activeColumn.id !== overColumn.id) {
        setColumns((prevColumns) => {
          const newColumns = [...prevColumns];
          const sourceColumnIndex = newColumns.findIndex(
            (col) => col.id === activeColumn.id,
          );
          const destinationColumnIndex = newColumns.findIndex(
            (col) => col.id === overColumn.id,
          );

          const sourceTasks = [...newColumns[sourceColumnIndex].tasks];
          const destinationTasks = [
            ...newColumns[destinationColumnIndex].tasks,
          ];

          const taskIndex = sourceTasks.findIndex(
            (task) => task.id === activeId,
          );
          if (taskIndex === -1) return prevColumns;

          const [movedTask] = sourceTasks.splice(taskIndex, 1);
          destinationTasks.push({ ...movedTask, columnId: overColumn.id });

          newColumns[sourceColumnIndex] = {
            ...newColumns[sourceColumnIndex],
            tasks: sourceTasks,
          };

          newColumns[destinationColumnIndex] = {
            ...newColumns[destinationColumnIndex],
            tasks: destinationTasks,
          };

          onTaskMove?.(activeId, activeColumn.id, overColumn.id);

          return newColumns;
        });
      } else {
        // Перемещение внутри одной колонки
        setColumns((prevColumns) => {
          const newColumns = [...prevColumns];
          const columnIndex = newColumns.findIndex(
            (col) => col.id === activeColumn.id,
          );
          const columnTasks = [...newColumns[columnIndex].tasks];

          const oldIndex = columnTasks.findIndex(
            (task) => task.id === activeId,
          );
          const newIndex = columnTasks.findIndex((task) => task.id === overId);

          if (oldIndex !== -1 && newIndex !== -1) {
            newColumns[columnIndex].tasks = arrayMove(
              columnTasks,
              oldIndex,
              newIndex,
            );
          }

          return newColumns;
        });
      }
    },
    [columns, getTaskColumn, onTaskMove],
  );

  // Модальное окно
  const handleOpenCreateModal = (columnId: ColumnId) => {
    setCurrentColumn(columnId);
    setModalMode("create");
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setModalMode("edit");
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Создание/редактирование задачи
  const handleTaskSubmit = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">,
  ) => {
    if (modalMode === "create") {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        ...taskData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setColumns((prevColumns) =>
        prevColumns.map((column) =>
          column.id === taskData.columnId
            ? { ...column, tasks: [...column.tasks, newTask] }
            : column,
        ),
      );
    } else if (modalMode === "edit" && editingTask) {
      setColumns((prevColumns) =>
        prevColumns.map((column) => ({
          ...column,
          tasks: column.tasks.map((t) =>
            t.id === editingTask.id
              ? {
                  ...t,
                  ...taskData,
                  updatedAt: new Date(),
                  id: editingTask.id,
                  createdAt: editingTask.createdAt,
                }
              : t,
          ),
        })),
      );
    }
  };

  // Удаление задачи
  const handleDeleteTask = useCallback((taskId: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        tasks: column.tasks.filter((task) => task.id !== taskId),
      })),
    );
  }, []);

  // Фильтрация задач
  const filteredColumns = React.useMemo(() => {
    if (!searchQuery && selectedPriority === "all") {
      return columns;
    }

    return columns.map((column) => ({
      ...column,
      tasks: column.tasks.filter((task) => {
        const matchesSearch = searchQuery
          ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase())
          : true;

        const matchesPriority =
          selectedPriority === "all"
            ? true
            : task.priority === selectedPriority;

        return matchesSearch && matchesPriority;
      }),
    }));
  }, [columns, searchQuery, selectedPriority]);

  // Сохранение в localStorage
  useEffect(() => {
    const saved = localStorage.getItem("kanban-data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const restored = parsed.map((col: any) => ({
          ...col,
          tasks: col.tasks.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
          })),
        }));
        setColumns(restored);
      } catch (e) {
        console.error("Ошибка загрузки данных:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("kanban-data", JSON.stringify(columns));
  }, [columns]);

  // Рассчитываем статистику
  const totalTasks = columns.reduce((acc, col) => acc + col.tasks.length, 0);
  const todoTasks = columns.find((c) => c.id === "todo")?.tasks.length || 0;
  const inProgressTasks =
    columns.find((c) => c.id === "in-progress")?.tasks.length || 0;
  const doneTasks = columns.find((c) => c.id === "done")?.tasks.length || 0;

  return (
    <div className={s.kanbanContainer}>
      {/* Панель управления */}
      <div className={s.controlPanel}>
        <h1>🚀 Kanban Dashboard (TypeScript)</h1>

        <div className={s.filters}>
          <div className={s.searchContainer}>
            <input
              type="text"
              placeholder="Поиск задач..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={s.searchInput}
            />
          </div>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className={s.priorityFilter}
          >
            <option value="all">Все приоритеты</option>
            <option value="high">Высокий</option>
            <option value="medium">Средний</option>
            <option value="low">Низкий</option>
          </select>

          <Button
            variant="primary"
            onClick={() => {
              setSearchQuery("");
              setSelectedPriority("all");
            }}
          >
            ⟳ Сбросить фильтры
          </Button>
        </div>

        {/* Статистика */}
        <div className={s.statsPanel}>
          <div className={s.statItem}>
            <h3>{totalTasks}</h3>
            <p>Всего задач</p>
          </div>
          <div className={s.statItem}>
            <h3>{todoTasks}</h3>
            <p>К выполнению</p>
          </div>
          <div className={s.statItem}>
            <h3>{inProgressTasks}</h3>
            <p>В работе</p>
          </div>
          <div className={s.statItem}>
            <h3>{doneTasks}</h3>
            <p>Выполнено</p>
          </div>
        </div>
      </div>

      {/* Канбан-доска */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className={s.kanbanBoard}>
          {filteredColumns.map((column) => (
            <ColumnComponent
              key={column.id}
              column={column}
              tasks={column.tasks}
              onAddTask={handleOpenCreateModal}
              onEditTask={handleOpenEditModal}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <TaskCard
              task={activeTask}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteTask}
            />
          )}
        </DragOverlay>
      </DndContext>

      {/* Модальное окно */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleTaskSubmit}
        initialData={editingTask || undefined}
        mode={modalMode}
        columnId={modalMode === "create" ? currentColumn : undefined}
      />
    </div>
  );
};

export default KanbanBoard;
