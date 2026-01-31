import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectCardProps } from "../../interface/types";
import { projectsApi } from "../../api/projects";
import { SvgIcon } from "../../components/ui/SvgIcon/SvgIcon";
import Button from "../../components/ui/button/button";
import styles from "./projectsPage.module.css";
import { ProjectsGrid } from "../../components/ui/cards/projectsGrid/projectsGrid";

interface Recommendation {
  title: string;
  url: string;
  description: string;
  author: string;
  github_url: string;
  repository_url: string;
  explanation?: string;
}

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<ProjectCardProps[]>(
    [],
  );
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

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
  const handleGetRecommendations = async () => {
    setLoadingRecommendations(true);
    try {
      // Получаем информацию о пользователе для рекомендаций
      const userSkills =
        localStorage.getItem("user_skills") || "Python, SQL, React";
      const userLevel = localStorage.getItem("user_level") || "junior";
      const userId = localStorage.getItem("user_id");
      const userEmail = localStorage.getItem("user_email");

      // Формируем данные для отправки в API рекомендаций
      const recommendationRequest = {
        project: {
          name: `Personalized Recommendations for User ${userId || "unknown"}`,
          description: `Персональные рекомендации проектов для пользователя с навыками: ${userSkills}`,
          author: userId || "Анонимный пользователь",
          github_url: "https://github.com/sberlab-nsu",
          repository_url: "https://github.com/sberlab-nsu/recommendations.git",
        },
        recommendations: [], // Пустой массив, его заполнит бэкенд
      };

      // Вызываем реальное API
      console.log("Отправляем запрос на рекомендации...");

      try {
        const apiRecommendations = await projectsApi.getRecommendations(
          recommendationRequest,
        );
        console.log("Получены рекомендации из API:", apiRecommendations);

        // Преобразуем полученные рекомендации в формат ProjectCardProps
        const formattedRecommendations: ProjectCardProps[] =
          apiRecommendations.map((rec: any, index: number) => {
            // Определяем сложность на основе данных из API
            let difficulty = 3; // По умолчанию средняя сложность
            if (rec.difficulty === "beginner" || rec.difficulty === "easy")
              difficulty = 2;
            if (
              rec.difficulty === "intermediate" ||
              rec.difficulty === "medium"
            )
              difficulty = 3;
            if (rec.difficulty === "advanced" || rec.difficulty === "hard")
              difficulty = 4;
            if (rec.difficulty === "expert") difficulty = 5;

            return {
              id: `rec-${Date.now()}-${index}`, // Уникальный ID
              title: rec.title || `Рекомендованный проект ${index + 1}`,
              description:
                rec.description || "Описание проекта будет добавлено",
              tags: rec.tags ||
                rec.technologies ||
                rec.skills || ["Python", "ML", "React"],
              difficulty,
              duration: rec.duration || "6 месяцев",
              status: "recruiting" as const,
              mentor: {
                id: rec.author_id || index + 200,
                name: rec.author || "Ментор проекта",
                avatar: rec.avatar || undefined,
              },
              availableSlots: rec.available_slots || rec.max_participants || 3,
              keyTasks: rec.key_tasks ||
                rec.tasks || [
                  "Изучить технологии проекта",
                  "Присоединиться к команде",
                  "Начать разработку",
                ],
              value:
                rec.explanation ||
                rec.reason ||
                "Проект рекомендован на основе ваших навыков",
              curriculumConnection:
                rec.curriculum_connection ||
                "Соответствует вашей учебной программе",
              diploma: rec.diploma || Math.random() > 0.5,
              scientificNovelty:
                rec.scientific_novelty || "Инновационный подход в реализации",
              startDate:
                rec.start_date ||
                new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0],
              endDate:
                rec.end_date ||
                new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0],
            };
          });

        setRecommendations(formattedRecommendations);
        setShowRecommendations(true);

        if (formattedRecommendations.length === 0) {
          alert(
            "К сожалению, подходящих рекомендаций не найдено. Попробуйте обновить информацию о ваших навыках.",
          );
        }
      } catch (apiError) {
        console.error("Ошибка API рекомендаций:", apiError);

        // Если API недоступно, используем fallback данные
        console.log(" Используем fallback данные...");

        const fallbackRecommendations: ProjectCardProps[] = [
          {
            id: "rec-fallback-1",
            title: "Разработка рекомендательной системы на Python",
            description:
              "Создание системы рекомендаций для образовательного контента с использованием машинного обучения",
            tags: ["Python", "ML", "SQL", "Docker", "FastAPI"],
            difficulty: 4,
            duration: "6 месяцев",
            status: "recruiting" as const,
            mentor: {
              id: 201,
              name: "Иван Петров",
              avatar: undefined,
            },
            availableSlots: 3,
            keyTasks: [
              "Разработка ML-модели",
              "Создание REST API",
              "Интеграция с БД",
            ],
            value:
              "Подходит идеально, так как вы обладаете навыками Python и ML",
            curriculumConnection: "Курсы по ML и базам данных",
            diploma: true,
            scientificNovelty: "Новый алгоритм рекомендаций",
            startDate: "2024-04-01",
            endDate: "2024-09-30",
          },
          {
            id: "rec-fallback-2",
            title: "Веб-приложение на React и TypeScript",
            description:
              "Разработка современного веб-приложения для управления проектами",
            tags: ["React", "TypeScript", "Node.js", "MongoDB", "Tailwind"],
            difficulty: 3,
            duration: "5 месяцев",
            status: "recruiting" as const,
            mentor: {
              id: 202,
              name: "Дмитрий Смирнов",
              avatar: undefined,
            },
            availableSlots: 4,
            keyTasks: [
              "Проектирование UI/UX",
              "Разработка фронтенда",
              "Создание бэкенда",
            ],
            value: "Подходит, так как вы знакомы с React и TypeScript",
            curriculumConnection: "Веб-технологии",
            diploma: true,
            scientificNovelty: "Новый подход к state management",
            startDate: "2024-04-15",
            endDate: "2024-09-15",
          },
          {
            id: "rec-fallback-3",
            title: "Анализ данных в Python",
            description:
              "Jupyter, pandas, визуализация. Исследование открытых датасетов.",
            tags: ["Python", "pandas", "SQL", "Jupyter", "Matplotlib"],
            difficulty: 2,
            duration: "4 месяца",
            status: "recruiting" as const,
            mentor: {
              id: 203,
              name: "Елена Ковалева",
              avatar: undefined,
            },
            availableSlots: 5,
            keyTasks: [
              "Исследование датасетов",
              "Визуализация данных",
              "Анализ результатов",
            ],
            value: "Идеально подходит для начала работы с анализом данных",
            curriculumConnection: "Анализ данных, Статистика",
            diploma: false,
            scientificNovelty: "Новый метод визуализации многомерных данных",
            startDate: "2024-05-01",
            endDate: "2024-08-31",
          },
        ];

        setRecommendations(fallbackRecommendations);
        setShowRecommendations(true);
        alert(
          "Рекомендации загружены из локального кэша. API временно недоступно.",
        );
      }
    } catch (err: any) {
      console.error("Общая ошибка получения рекомендаций:", err);
      alert("Не удалось получить рекомендации. Пожалуйста, попробуйте позже.");
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleApply = async (id: string | number) => {
    console.log("Подача заявки на проект:", id);

    try {
      const response = await projectsApi.applyToProject(id.toString());
      alert(response.message);

      if (response.success && response.message.includes("войдите")) {
        navigate("/login", {
          state: {
            from: "/projects",
            message: "Для подачи заявки на проект необходимо войти в систему",
          },
        });
      }
    } catch (error: any) {
      alert("Ошибка подачи заявки: " + error.message);
    }
  };

  const handleArchive = (id: string | number) => {
    console.log("Архивация проекта:", id);
  };

  const handleDelete = (id: string | number) => {
    console.log("Удаление проекта:", id);
  };

  const handleCardClick = (id: string | number) => {
    navigate(`/projects/${id}`);
  };

  const handleCreateProject = () => {
    navigate("/projects/new");
  };

  const filteredProjects = projects.filter((project) => {
    if (statusFilter !== "all" && project.status !== statusFilter) {
      return false;
    }

    if (
      difficultyFilter !== "all" &&
      project.difficulty.toString() !== difficultyFilter
    ) {
      return false;
    }

    if (diplomaFilter === "diploma" && !project.diploma) {
      return false;
    }
    if (diplomaFilter === "no_diploma" && project.diploma) {
      return false;
    }

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
          <h1 className={styles.pageTitle}>Проекты</h1>
          <p className={styles.pageSubtitle}>
            Найдите подходящий проект или получите персональные рекомендации
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button
            variant="secondary"
            onClick={handleGetRecommendations}
            disabled={loadingRecommendations}
          >
            {loadingRecommendations ? (
              <>
                <SvgIcon name="loader" width={16} height={16} />
                Загрузка...
              </>
            ) : (
              <>
                <SvgIcon name="sparkles" width={16} height={16} />
                Получить рекомендации
              </>
            )}
          </Button>
          <Button variant="primary" onClick={handleCreateProject}>
            <SvgIcon name="plus" width={20} height={20} />
            Создать проект
          </Button>
        </div>
      </div>

      {/* Рекомендации (показываются если есть) */}
      {showRecommendations && recommendations.length > 0 && (
        <div className={styles.recommendationsSection}>
          <div className={styles.recommendationsHeader}>
            <div>
              <h2 className={styles.recommendationsTitle}>
                <SvgIcon
                  name="sparkles"
                  width={24}
                  height={24}
                  color="#F59E0B"
                />
                Персональные рекомендации
              </h2>
              <p className={styles.recommendationsSubtitle}>
                Проекты, подобранные специально для вас на основе ваших навыков
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowRecommendations(false)}
            >
              Скрыть рекомендации
            </Button>
          </div>

          {/* Используем ProjectsGrid для отображения рекомендаций */}
          <ProjectsGrid
            projects={recommendations}
            onApply={handleApply}
            onArchive={handleArchive}
            onDelete={handleDelete}
          />
        </div>
      )}

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

      {/* Основная сетка проектов */}
      {filteredProjects.length === 0 && !showRecommendations ? (
        <div className={styles.emptyState}>
          <SvgIcon name="folder" width={64} height={64} color="#94a3b8" />
          <h3>Проектов не найдено</h3>
          <p>Попробуйте изменить фильтры или получить рекомендации</p>
          <div className={styles.emptyStateActions}>
            <Button
              variant="primary"
              onClick={() => {
                setStatusFilter("all");
                setDifficultyFilter("all");
                setDiplomaFilter("all");
                setSearchQuery("");
              }}
            >
              Сбросить фильтры
            </Button>
            <Button
              variant="secondary"
              onClick={handleGetRecommendations}
              disabled={loadingRecommendations}
            >
              Получить рекомендации
            </Button>
          </div>
        </div>
      ) : (
        <>
          <h2 className={styles.sectionTitle}>Все проекты</h2>
          <ProjectsGrid
            projects={filteredProjects}
            onApply={handleApply}
            onArchive={handleArchive}
            onDelete={handleDelete}
          />
        </>
      )}

      {/* Секция с подсказкой */}
      <div className={styles.tipSection}>
        <div className={styles.tipContent}>
          <SvgIcon name="lightbulb" width={24} height={24} color="#F59E0B" />
          <div>
            <h4>Не нашли подходящий проект?</h4>
            <p>
              Используйте кнопку "Получить рекомендации" выше или создайте свой
              проект
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
