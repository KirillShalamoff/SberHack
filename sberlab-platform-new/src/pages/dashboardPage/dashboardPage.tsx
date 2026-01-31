import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SvgIcon } from "../../components/ui/SvgIcon/SvgIcon";
import Button from "../../components/ui/button/button";
import styles from "./dashboardPage.module.css";

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{
    user_id: string;
    role: string;
    email?: string;
  } | null>(null);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedTasks: 0,
    teamMembers: 0,
  });

  useEffect(() => {
    // Загружаем информацию о пользователе
    const userId = localStorage.getItem("user_id");
    const userRole = localStorage.getItem("user_role");
    const userEmail = localStorage.getItem("user_email");

    if (!userId || !userRole) {
      navigate("/login");
      return;
    }

    setUser({
      user_id: userId,
      role: userRole,
      email: userEmail || undefined,
    });

    // Загружаем статистику (заглушка)
    // В реальном приложении здесь будет API запрос
    setStats({
      totalProjects: 12,
      activeProjects: 5,
      completedTasks: 47,
      teamMembers: 8,
    });
  }, [navigate]);

  if (!user) {
    return <div>Загрузка...</div>;
  }

  const quickActions = [
    {
      title: "Создать проект",
      description: "Начните новый проект",
      icon: "plus-circle",
      path: "/projects/new",
      color: "#00A36F",
    },
    {
      title: "Канбан доска",
      description: "Управление задачами",
      icon: "trello",
      path: "/kanban",
      color: "#3B82F6",
    },
    {
      title: "Найти команду",
      description: "Поиск участников",
      icon: "users",
      path: "/team/find",
      color: "#8B5CF6",
    },
    {
      title: "Мои проекты",
      description: "Просмотр активных проектов",
      icon: "briefcase",
      path: "/projects/my",
      color: "#F59E0B",
    },
  ];

  const recentProjects = [
    {
      id: 1,
      name: "Разработка CRM системы",
      progress: 75,
      deadline: "15.12.2024",
    },
    {
      id: 2,
      name: "ML модель для прогнозирования",
      progress: 30,
      deadline: "20.01.2025",
    },
    {
      id: 3,
      name: "Мобильное приложение для НГУ",
      progress: 90,
      deadline: "10.12.2024",
    },
  ];

  return (
    <div className={styles.dashboard}>
      {/* Приветствие */}
      <div className={styles.welcomeSection}>
        <div>
          <h1 className={styles.title}>
            Добро пожаловать, {user.role === "student" ? "студент" : "ментор"}!
          </h1>
          <p className={styles.subtitle}>
            Управляйте своими проектами, задачами и командой на одной платформе
          </p>
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            <SvgIcon name="user" width={24} height={24} />
          </div>
          <div>
            <p className={styles.userEmail}>{user.email || user.user_id}</p>
            <p className={styles.userRole}>
              {user.role === "student" ? "👨‍🎓 Студент" : "👨‍🏫 Ментор"}
            </p>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#E0F2F1" }}>
            <SvgIcon name="briefcase" width={24} height={24} color="#00A36F" />
          </div>
          <div>
            <h3>{stats.totalProjects}</h3>
            <p>Всего проектов</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#EFF6FF" }}>
            <SvgIcon name="activity" width={24} height={24} color="#3B82F6" />
          </div>
          <div>
            <h3>{stats.activeProjects}</h3>
            <p>Активных проектов</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#F0F9FF" }}>
            <SvgIcon
              name="check-circle"
              width={24}
              height={24}
              color="#0EA5E9"
            />
          </div>
          <div>
            <h3>{stats.completedTasks}</h3>
            <p>Выполненных задач</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#FEF3C7" }}>
            <SvgIcon name="users" width={24} height={24} color="#D97706" />
          </div>
          <div>
            <h3>{stats.teamMembers}</h3>
            <p>Участников в команде</p>
          </div>
        </div>
      </div>

      {/* Быстрые действия */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Быстрые действия</h2>
        <div className={styles.actionsGrid}>
          {quickActions.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className={styles.actionCard}
            >
              <div
                className={styles.actionIcon}
                style={{ color: action.color }}
              >
                <SvgIcon name={action.icon} width={32} height={32} />
              </div>
              <div>
                <h4>{action.title}</h4>
                <p>{action.description}</p>
              </div>
              <SvgIcon
                name="chevron-right"
                width={20}
                height={20}
                color="#94A3B8"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Последние проекты */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Последние проекты</h2>
          <Button variant="secondary" onClick={() => navigate("/projects")}>
            Все проекты
          </Button>
        </div>
        <div className={styles.projectsList}>
          {recentProjects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.projectHeader}>
                <h4>{project.name}</h4>
                <span className={styles.deadline}>
                  Дедлайн: {project.deadline}
                </span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <div className={styles.projectFooter}>
                <span>{project.progress}% выполнено</span>
                <Button variant="primary">Перейти</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
