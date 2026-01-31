const API_BASE_URL = "http://localhost:8080";

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  difficulty: number;
  duration: string;
  status: "recruiting" | "in_progress" | "completed" | "archived";
  mentor: {
    id: number;
    name: string;
    avatar?: string;
    email?: string;
  };
  availableSlots: number;
  keyTasks?: string[];
  value?: string;
  curriculumConnection?: string;
  diploma: boolean;
  scientificNovelty?: string;
  startDate?: string;
  endDate?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectCardProps {
  id: string | number;
  title: string;
  description: string;
  tags: string[];
  difficulty: number;
  duration: string;
  status: "recruiting" | "in_progress" | "completed" | "archived";
  mentor: {
    name: string;
    avatar?: string;
  };
  availableSlots: number;
  onApply?: (id: string | number) => void;
  onArchive?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onClick?: (id: string | number) => void;
  keyTasks?: string[];
  value?: string;
  curriculumConnection?: string;
  diploma?: boolean;
  scientificNovelty?: string;
  startDate?: string;
  endDate?: string;
}

export const projectsApi = {
  // Получение списка проектов
  async getProjects(): Promise<Project[]> {
    try {
      // Временная заглушка
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: "1",
              title: "Разработка рекомендательной системы на Python",
              description:
                "Создание системы рекомендаций для образовательного контента с использованием машинного обучения",
              tags: ["Python", "ML", "SQL", "Docker", "FastAPI"],
              difficulty: 4,
              duration: "6 месяцев",
              status: "recruiting",
              mentor: {
                id: 1,
                name: "Иван Петров",
                email: "ivan@example.com",
              },
              availableSlots: 3,
              keyTasks: [
                "Разработка ML-модели",
                "Создание REST API",
                "Интеграция с БД",
              ],
              value: "Получение опыта в ML и веб-разработке",
              curriculumConnection: "Курсы по ML и базам данных",
              diploma: true,
              scientificNovelty: "Новый алгоритм рекомендаций",
              startDate: "2024-03-01",
              endDate: "2024-08-31",
              created_at: "2024-01-15",
            },
            {
              id: "2",
              title: "Создание аналитической системы на SQL и Python",
              description:
                "Разработка системы аналитики данных для образовательной платформы",
              tags: ["Python", "SQL", "Data Analysis", "Pandas", "PostgreSQL"],
              difficulty: 3,
              duration: "4 месяца",
              status: "recruiting",
              mentor: {
                id: 1,
                name: "Мария Сидорова",
                email: "maria@example.com",
              },
              availableSlots: 2,
              keyTasks: [
                "Проектирование БД",
                "Разработка ETL-процессов",
                "Создание дашбордов",
              ],
              value: "Практический опыт работы с большими данными",
              curriculumConnection: "Базы данных и анализ данных",
              diploma: false,
              startDate: "2024-02-15",
              endDate: "2024-06-15",
              created_at: "2024-01-20",
            },
            {
              id: "3",
              title: "Разработка микросервиса на Go",
              description:
                "Создание микросервиса для обработки пользовательских событий",
              tags: ["Go", "Docker", "Kubernetes", "PostgreSQL", "gRPC"],
              difficulty: 5,
              duration: "8 месяцев",
              status: "in_progress",
              mentor: {
                id: 1,
                name: "Алексей Иванов",
                email: "alexey@example.com",
              },
              availableSlots: 1,
              keyTasks: [
                "Проектирование архитектуры",
                "Реализация бизнес-логики",
                "Настройка CI/CD",
              ],
              value: "Опыт работы с микросервисной архитектурой",
              curriculumConnection: "Распределенные системы",
              diploma: true,
              scientificNovelty: "Новый подход к обработке событий",
              startDate: "2024-01-10",
              endDate: "2024-09-10",
              created_at: "2023-12-20",
            },
            {
              id: "4",
              title: "Веб-приложение на React и TypeScript",
              description:
                "Разработка современного веб-приложения для управления проектами",
              tags: ["React", "TypeScript", "Node.js", "MongoDB", "Tailwind"],
              difficulty: 3,
              duration: "5 месяцев",
              status: "recruiting",
              mentor: {
                id: 1,
                name: "Дмитрий Смирнов",
                email: "dmitry@example.com",
              },
              availableSlots: 4,
              keyTasks: [
                "Проектирование UI/UX",
                "Разработка фронтенда",
                "Создание бэкенда",
              ],
              value: "Полный цикл разработки веб-приложения",
              curriculumConnection: "Веб-технологии",
              diploma: true,
              startDate: "2024-03-15",
              endDate: "2024-08-15",
              created_at: "2024-02-01",
            },
            {
              id: "5",
              title: "Мобильное приложение для НГУ",
              description:
                "Разработка кроссплатформенного мобильного приложения для студентов НГУ",
              tags: ["React Native", "TypeScript", "Firebase", "Redux", "Expo"],
              difficulty: 4,
              duration: "7 месяцев",
              status: "completed",
              mentor: {
                id: 1,
                name: "Екатерина Волкова",
                email: "ekaterina@example.com",
              },
              availableSlots: 0,
              keyTasks: [
                "Проектирование архитектуры",
                "Разработка UI",
                "Интеграция с API",
              ],
              value: "Опыт разработки мобильных приложений",
              curriculumConnection: "Мобильная разработка",
              diploma: true,
              scientificNovelty: "Новый подход к навигации в приложении",
              startDate: "2023-09-01",
              endDate: "2024-03-31",
              created_at: "2023-08-15",
            },
            {
              id: "6",
              title: "Чат-бот для поддержки студентов",
              description:
                "Создание интеллектуального чат-бота на базе GPT для ответов на вопросы студентов",
              tags: ["Python", "FastAPI", "OpenAI API", "Docker", "Redis"],
              difficulty: 4,
              duration: "6 месяцев",
              status: "recruiting",
              mentor: {
                id: 1,
                name: "Сергей Козлов",
                email: "sergey@example.com",
              },
              availableSlots: 2,
              keyTasks: [
                "Обучение модели",
                "Разработка API",
                "Интеграция с мессенджерами",
              ],
              value: "Опыт работы с AI и NLP",
              curriculumConnection: "Искусственный интеллект",
              diploma: false,
              startDate: "2024-04-01",
              endDate: "2024-09-30",
              created_at: "2024-02-10",
            },
            {
              id: "7",
              title: "Система мониторинга инфраструктуры",
              description: "Создание системы мониторинга серверов и приложений",
              tags: ["Go", "Prometheus", "Grafana", "Docker", "Kubernetes"],
              difficulty: 5,
              duration: "9 месяцев",
              status: "archived",
              mentor: {
                id: 1,
                name: "Андрей Николаев",
                email: "andrey@example.com",
              },
              availableSlots: 0,
              keyTasks: [
                "Настройка мониторинга",
                "Создание дашбордов",
                "Автоматизация алертинга",
              ],
              value: "Опыт работы с DevOps инструментами",
              curriculumConnection: "Системное администрирование",
              diploma: true,
              startDate: "2023-06-01",
              endDate: "2024-02-29",
              created_at: "2023-05-15",
            },
            {
              id: "8",
              title: "Анализ данных социальных сетей",
              description:
                "Исследование и анализ данных из социальных сетей для выявления трендов",
              tags: ["Python", "Pandas", "Matplotlib", "API", "Data Mining"],
              difficulty: 3,
              duration: "4 месяца",
              status: "recruiting",
              mentor: {
                id: 1,
                name: "Ольга Кузнецова",
                email: "olga@example.com",
              },
              availableSlots: 3,
              keyTasks: [
                "Сбор данных",
                "Очистка данных",
                "Визуализация результатов",
              ],
              value: "Опыт работы с большими данными и визуализацией",
              curriculumConnection: "Анализ данных",
              diploma: false,
              startDate: "2024-03-01",
              endDate: "2024-06-30",
              created_at: "2024-01-25",
            },
          ]);
        }, 500);
      });
    } catch (error) {
      console.error("Ошибка получения проектов:", error);
      throw error;
    }
  },

  // Подача заявки на проект
  async applyToProject(
    projectId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/projects/${projectId}/apply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Ошибка подачи заявки");
      }

      return response.json();
    } catch (error) {
      console.error("Ошибка подачи заявки:", error);
      throw error;
    }
  },

  // Получение рекомендаций для проекта
  async getRecommendations(projectData: any): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/recommend/project`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error("Ошибка получения рекомендаций");
      }

      return response.json();
    } catch (error) {
      console.error("Ошибка получения рекомендаций:", error);
      throw error;
    }
  },
};
