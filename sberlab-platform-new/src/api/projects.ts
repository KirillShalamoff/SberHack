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
    id: number;
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
              title: "Веб-приложение на Go",
              description:
                "Бэкенд на Go, REST API, работа с БД. Мини-соцсеть или трекер задач.",
              tags: ["Go", "SQL", "REST"],
              difficulty: 3, // medium -> 3
              duration: "6 месяцев",
              status: "recruiting",
              mentor: {
                id: 101,
                name: "Александр Голубев",
                email: "alexander@example.com",
              },
              availableSlots: 4,
              keyTasks: [
                "Разработка REST API",
                "Проектирование базы данных",
                "Реализация бизнес-логики",
              ],
              value:
                "Практический опыт работы с Go и микросервисной архитектурой",
              curriculumConnection: "Системное программирование, Базы данных",
              diploma: true,
              scientificNovelty: "Новый подход к построению RESTful API на Go",
              startDate: "2024-03-01",
              endDate: "2024-08-31",
              created_at: "2024-01-15",
            },
            {
              id: "2",
              title: "Анализ данных в Python",
              description:
                "Jupyter, pandas, визуализация. Исследование открытых датасетов.",
              tags: ["Python", "pandas", "SQL", "Jupyter", "Matplotlib"],
              difficulty: 2, // easy -> 2
              duration: "4 месяца",
              status: "recruiting",
              mentor: {
                id: 102,
                name: "Елена Ковалева",
                email: "elena@example.com",
              },
              availableSlots: 5,
              keyTasks: [
                "Исследование датасетов",
                "Визуализация данных",
                "Анализ результатов",
              ],
              value: "Опыт работы с анализом данных и визуализацией",
              curriculumConnection: "Анализ данных, Статистика",
              diploma: false,
              scientificNovelty: "Новый метод визуализации многомерных данных",
              startDate: "2024-02-15",
              endDate: "2024-06-15",
              created_at: "2024-01-20",
            },
            {
              id: "3",
              title: "Микросервисы и Docker",
              description: "Несколько сервисов, оркестрация, API Gateway.",
              tags: ["Docker", "Go", "Linux", "Kubernetes", "API Gateway"],
              difficulty: 5, // hard -> 5
              duration: "8 месяцев",
              status: "in_progress",
              mentor: {
                id: 103,
                name: "Дмитрий Волков",
                email: "dmitry@example.com",
              },
              availableSlots: 2,
              keyTasks: [
                "Настройка Docker контейнеров",
                "Оркестрация сервисов",
                "Реализация API Gateway",
              ],
              value:
                "Глубокое понимание микросервисной архитектуры и контейнеризации",
              curriculumConnection: "Распределенные системы, DevOps",
              diploma: true,
              scientificNovelty: "Новый подход к оркестрации микросервисов",
              startDate: "2024-01-10",
              endDate: "2024-09-10",
              created_at: "2023-12-20",
            },
            {
              id: "4",
              title: "Чат-бот на Python",
              description: "Telegram или VK бот, диалоги, хранение состояния.",
              tags: ["Python", "API", "Telegram", "FastAPI", "SQLite"],
              difficulty: 2, // easy -> 2
              duration: "3 месяца",
              status: "recruiting",
              mentor: {
                id: 104,
                name: "Ирина Петрова",
                email: "irina@example.com",
              },
              availableSlots: 6,
              keyTasks: [
                "Разработка логики бота",
                "Интеграция с мессенджерами",
                "Реализация хранения состояния",
              ],
              value: "Опыт создания интерактивных чат-ботов",
              curriculumConnection: "Веб-технологии, Базы данных",
              diploma: false,
              scientificNovelty: "Новый алгоритм обработки естественного языка",
              startDate: "2024-03-15",
              endDate: "2024-06-15",
              created_at: "2024-02-01",
            },
            {
              id: "5",
              title: "ML-модель для классификации",
              description:
                "Обучение модели на реальных данных, метрики, деплой.",
              tags: ["Python", "ML", "scikit-learn", "TensorFlow", "Docker"],
              difficulty: 5, // hard -> 5
              duration: "7 месяцев",
              status: "completed",
              mentor: {
                id: 105,
                name: "Сергей Иванов",
                email: "sergey@example.com",
              },
              availableSlots: 0,
              keyTasks: [
                "Подготовка данных",
                "Обучение моделей",
                "Деплой решения",
              ],
              value: "Полный цикл разработки ML-решения",
              curriculumConnection:
                "Машинное обучение, Искусственный интеллект",
              diploma: true,
              scientificNovelty:
                "Новая архитектура нейронной сети для классификации",
              startDate: "2023-09-01",
              endDate: "2024-03-31",
              created_at: "2023-08-15",
            },
            // Оставляю ваши оригинальные проекты с небольшими изменениями для разнообразия
            {
              id: "6",
              title: "Разработка рекомендательной системы на Python",
              description:
                "Создание системы рекомендаций для образовательного контента с использованием машинного обучения",
              tags: ["Python", "ML", "SQL", "Docker", "FastAPI"],
              difficulty: 4,
              duration: "6 месяцев",
              status: "recruiting",
              mentor: {
                id: 106,
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
              startDate: "2024-04-01",
              endDate: "2024-09-30",
              created_at: "2024-02-10",
            },
            {
              id: "7",
              title: "Веб-приложение на React и TypeScript",
              description:
                "Разработка современного веб-приложения для управления проектами",
              tags: ["React", "TypeScript", "Node.js", "MongoDB", "Tailwind"],
              difficulty: 3,
              duration: "5 месяцев",
              status: "recruiting",
              mentor: {
                id: 107,
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
              scientificNovelty: "Новый подход к state management",
              startDate: "2024-03-15",
              endDate: "2024-08-15",
              created_at: "2024-02-01",
            },
            {
              id: "8",
              title: "Анализ данных социальных сетей",
              description:
                "Исследование и анализ данных из социальных сетей для выявления трендов",
              tags: ["Python", "Pandas", "Matplotlib", "API", "Data Mining"],
              difficulty: 3,
              duration: "4 месяца",
              status: "archived",
              mentor: {
                id: 108,
                name: "Ольга Кузнецова",
                email: "olga@example.com",
              },
              availableSlots: 0,
              keyTasks: [
                "Сбор данных",
                "Очистка данных",
                "Визуализация результатов",
              ],
              value: "Опыт работы с большими данными и визуализацией",
              curriculumConnection: "Анализ данных",
              diploma: false,
              scientificNovelty: "Новый метод анализа социальных графов",
              startDate: "2023-09-01",
              endDate: "2024-01-01",
              created_at: "2023-08-25",
            },
            {
              id: "9",
              title: "Мобильное приложение для НГУ",
              description:
                "Разработка кроссплатформенного мобильного приложения для студентов НГУ",
              tags: ["React Native", "TypeScript", "Firebase", "Redux", "Expo"],
              difficulty: 4,
              duration: "7 месяцев",
              status: "in_progress",
              mentor: {
                id: 109,
                name: "Екатерина Волкова",
                email: "ekaterina@example.com",
              },
              availableSlots: 2,
              keyTasks: [
                "Проектирование архитектуры",
                "Разработка UI",
                "Интеграция с API",
              ],
              value: "Опыт разработки мобильных приложений",
              curriculumConnection: "Мобильная разработка",
              diploma: true,
              scientificNovelty: "Новый подход к навигации в приложении",
              startDate: "2024-01-15",
              endDate: "2024-08-15",
              created_at: "2023-12-20",
            },
            {
              id: "10",
              title: "Система мониторинга инфраструктуры",
              description: "Создание системы мониторинга серверов и приложений",
              tags: ["Go", "Prometheus", "Grafana", "Docker", "Kubernetes"],
              difficulty: 5,
              duration: "9 месяцев",
              status: "recruiting",
              mentor: {
                id: 110,
                name: "Андрей Николаев",
                email: "andrey@example.com",
              },
              availableSlots: 1,
              keyTasks: [
                "Настройка мониторинга",
                "Создание дашбордов",
                "Автоматизация алертинга",
              ],
              value: "Опыт работы с DevOps инструментами",
              curriculumConnection: "Системное администрирование",
              diploma: true,
              scientificNovelty: "Новый алгоритм прогнозирования нагрузки",
              startDate: "2024-04-01",
              endDate: "2024-12-31",
              created_at: "2024-02-15",
            },
          ]);
        }, 500);
      });
    } catch (error) {
      console.error("Ошибка получения проектов:", error);
      throw error;
    }
  },

  // Подача заявки на проект (эмуляция для неавторизованных; для авторизованных — реальный API)
  async applyToProject(
    projectId: string,
  ): Promise<{ success: boolean; message: string }> {
    const token = localStorage.getItem("access_token");
    if (!token) {
      // Эмуляция для неавторизованного пользователя
      return new Promise((resolve) => {
        setTimeout(
          () =>
            resolve({
              success: true,
              message: "Для подачи заявки войдите в аккаунт",
            }),
          300,
        );
      });
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/projects/${projectId}/apply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
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
