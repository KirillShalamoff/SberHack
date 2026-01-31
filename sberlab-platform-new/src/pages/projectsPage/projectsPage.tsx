import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectCardProps } from "../../interface/types";
import { projectsApi } from "../../api/projects";
import { SvgIcon } from "../../components/ui/SvgIcon/SvgIcon";
import Button from "../../components/ui/button/button";
import styles from "./projectsPage.module.css";
import { ProjectsGrid } from "../../components/ui/cards/projectsGrid/projectsGrid";

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Фильтры
  const [statusFilter, setStatusFilter] = useState<
    "all" | "recruiting" | "in_progress" | "completed" | "archived"
  >("all");
  const [difficultyFilter, setDifficultyFilter] = useState<
    "all" | "1" | "2" | "3" | "4" | "5"
  >("all");
  const [diplomaFilter, setDiplomaFilter] = useState<
    "all" | "diploma" | "no_diploma"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiProjects = await projectsApi.getProjects();

      // Преобразуем в формат для ProjectCard
      const formattedProjects: ProjectCardProps[] = apiProjects.map(
        (project) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          tags: project.tags,
          difficulty: project.difficulty,
          duration: project.duration,
          status: project.status,
          mentor: {
            id: project.mentor.id,
            name: project.mentor.name,
            avatar: project.mentor.avatar,
          },
          availableSlots: project.availableSlots,
          keyTasks: project.keyTasks,
          value: project.value,
          curriculumConnection: project.curriculumConnection,
          diploma: project.diploma,
          scientificNovelty: project.scientificNovelty,
          startDate: project.startDate,
          endDate: project.endDate,
        }),
      );

      setProjects(formattedProjects);
    } catch (err: any) {
      setError(err.message || "Не удалось загрузить проекты");
      console.error("Ошибка загрузки проектов:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (id: string | number) => {
    console.log("Подача заявки на проект:", id);
    // Здесь будет вызов API для подачи заявки
    projectsApi
      .applyToProject(id.toString())
      .then((response) => {
        alert("Заявка успешно подана!");
        // Обновляем список проектов
        loadProjects();
      })
      .catch((error) => {
        alert("Ошибка подачи заявки: " + error.message);
      });
  };

  const handleArchive = (id: string | number) => {
    console.log("Архивация проекта:", id);
    // Здесь будет вызов API для архивации
  };

  const handleDelete = (id: string | number) => {
    console.log("Удаление проекта:", id);
    // Здесь будет вызов API для удаления
  };

  const handleCardClick = (id: string | number) => {
    navigate(`/projects/${id}`);
  };

  const handleCreateProject = () => {
    navigate("/projects/new");
  };

  // Фильтрация проектов
  const filteredProjects = projects.filter((project) => {
    // Фильтр по статусу
    if (statusFilter !== "all" && project.status !== statusFilter) {
      return false;
    }

    // Фильтр по сложности
    if (
      difficultyFilter !== "all" &&
      project.difficulty.toString() !== difficultyFilter
    ) {
      return false;
    }

    // Фильтр по диплому
    if (diplomaFilter === "diploma" && !project.diploma) {
      return false;
    }
    if (diplomaFilter === "no_diploma" && project.diploma) {
      return false;
    }

    // Поиск по названию, описанию и тегам
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchIn = [
        project.title,
        project.description,
        ...project.tags,
        project.mentor.name,
        project.value || "",
        project.curriculumConnection || "",
        project.scientificNovelty || "",
      ]
        .join(" ")
        .toLowerCase();

      return searchIn.includes(query);
    }

    return true;
  });

  // Группировка проектов по статусу
  const recruitingProjects = filteredProjects.filter(
    (p) => p.status === "recruiting",
  );
  const inProgressProjects = filteredProjects.filter(
    (p) => p.status === "in_progress",
  );
  const completedProjects = filteredProjects.filter(
    (p) => p.status === "completed",
  );
  const archivedProjects = filteredProjects.filter(
    (p) => p.status === "archived",
  );

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Загрузка проектов...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <SvgIcon name="alert-circle" width={48} height={48} color="#EF4444" />
        <h3>Ошибка загрузки проектов</h3>
        <p>{error}</p>
        <Button variant="primary" onClick={loadProjects}>
          Попробовать снова
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.projectsPage}>
      {/* Хедер страницы */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Проекты СберЛаб-НГУ</h1>
          <p className={styles.pageSubtitle}>
            Найдите проект по интересам, участвуйте в реальных задачах и
            развивайте навыки
          </p>
        </div>
        <Button variant="primary" onClick={handleCreateProject}>
          <SvgIcon name="plus" width={20} height={20} />
          Создать проект
        </Button>
      </div>

      {/* Быстрая статистика */}
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>{recruitingProjects.length}</div>
          <div className={styles.statLabel}>Идет набор</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>{inProgressProjects.length}</div>
          <div className={styles.statLabel}>В работе</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>{completedProjects.length}</div>
          <div className={styles.statLabel}>Завершено</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>{archivedProjects.length}</div>
          <div className={styles.statLabel}>Архив</div>
        </div>
      </div>

      {/* Фильтры и поиск */}
      <div className={styles.filtersSection}>
        <div className={styles.searchBar}>
          <SvgIcon name="search" width={20} height={20} color="#64748b" />
          <input
            type="text"
            placeholder="Поиск по названию, описанию, технологиям..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterControls}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Статус:</label>
            <select
              className={styles.filterSelect}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">Все статусы</option>
              <option value="recruiting">Идет набор</option>
              <option value="in_progress">В работе</option>
              <option value="completed">Завершены</option>
              <option value="archived">Архив</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Сложность:</label>
            <select
              className={styles.filterSelect}
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as any)}
            >
              <option value="all">Любая</option>
              <option value="1">1 звезда</option>
              <option value="2">2 звезды</option>
              <option value="3">3 звезды</option>
              <option value="4">4 звезды</option>
              <option value="5">5 звезд</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Диплом:</label>
            <select
              className={styles.filterSelect}
              value={diplomaFilter}
              onChange={(e) => setDiplomaFilter(e.target.value as any)}
            >
              <option value="all">Все проекты</option>
              <option value="diploma">С дипломом</option>
              <option value="no_diploma">Без диплома</option>
            </select>
          </div>

          <Button
            variant="secondary"
            onClick={() => {
              setStatusFilter("all");
              setDifficultyFilter("all");
              setDiplomaFilter("all");
              setSearchQuery("");
            }}
            className={styles.resetButton}
          >
            <SvgIcon name="refresh-ccw" width={16} height={16} />
            Сбросить фильтры
          </Button>
        </div>
      </div>

      {/* Информация о результатах */}
      <div className={styles.resultsInfo}>
        <p>
          Найдено проектов: <strong>{filteredProjects.length}</strong>
          {filteredProjects.length !== projects.length && (
            <span> из {projects.length}</span>
          )}
        </p>
      </div>

      {/* Сетка проектов */}
      <ProjectsGrid
        projects={filteredProjects}
        onApply={handleApply}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onCardClick={handleCardClick}
      />

      {/* Призыв к действию */}
      <div className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <SvgIcon name="rocket" width={64} height={64} color="#00A36F" />
          <h3>Не нашли подходящий проект?</h3>
          <p>Создайте свой проект и соберите команду единомышленников</p>
          <Button variant="primary" onClick={handleCreateProject}>
            Создать проект
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
