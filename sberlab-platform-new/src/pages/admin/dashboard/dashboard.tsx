import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApiService, Stats } from "../../../services/adminApi";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminApiService.getStats();
      setStats(data);
    } catch (err) {
      setError("Ошибка загрузки статистики");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Загрузка статистики...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={fetchStats} className={styles.retryButton}>
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Панель администратора</h1>
        <button
          onClick={() => navigate("/admin/users")}
          className={styles.usersButton}
        >
          Управление пользователями
        </button>
      </div>

      {stats && (
        <>
          {/* Карточки с основной статистикой */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statIcon}>👥</span>
                <h3 className={styles.statTitle}>Всего пользователей</h3>
              </div>
              <p className={styles.statValue}>{stats.totalUsers}</p>
              <div className={styles.statTrend}>
                <span className={styles.trendPositive}>
                  +{stats.newUsersToday} сегодня
                </span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statIcon}>✅</span>
                <h3 className={styles.statTitle}>Активные</h3>
              </div>
              <p className={styles.statValue}>{stats.activeUsers}</p>
              <div className={styles.statSubtext}>
                {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% от
                общего числа
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statIcon}>⏳</span>
                <h3 className={styles.statTitle}>Ожидают</h3>
              </div>
              <p className={styles.statValue}>{stats.pendingUsers}</p>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statIcon}>🚫</span>
                <h3 className={styles.statTitle}>Заблокированы</h3>
              </div>
              <p className={styles.statValue}>{stats.blockedUsers}</p>
            </div>
          </div>

          {/* Распределение по ролям */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Распределение по ролям</h2>
            <div className={styles.rolesGrid}>
              <div className={styles.roleCard}>
                <div className={styles.roleHeader}>
                  <span className={styles.roleIcon}>👤</span>
                  <h3 className={styles.roleTitle}>Пользователи</h3>
                </div>
                <p className={styles.roleValue}>{stats.usersByRole.user}</p>
              </div>

              <div className={styles.roleCard}>
                <div className={styles.roleHeader}>
                  <span className={styles.roleIcon}>🛡️</span>
                  <h3 className={styles.roleTitle}>Модераторы</h3>
                </div>
                <p className={styles.roleValue}>
                  {stats.usersByRole.moderator}
                </p>
              </div>

              <div className={styles.roleCard}>
                <div className={styles.roleHeader}>
                  <span className={styles.roleIcon}>👑</span>
                  <h3 className={styles.roleTitle}>Администраторы</h3>
                </div>
                <p className={styles.roleValue}>{stats.usersByRole.admin}</p>
              </div>
            </div>
          </div>

          {/* Быстрые действия */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Быстрые действия</h2>
            <div className={styles.actionsGrid}>
              <button
                onClick={() => handleNavigation("/admin/users?status=pending")}
                className={styles.actionButton}
              >
                <span className={styles.actionIcon}>⏳</span>
                <span className={styles.actionText}>Просмотреть ожидающих</span>
              </button>

              <button
                onClick={() => handleNavigation("/admin/users?role=user")}
                className={styles.actionButton}
              >
                <span className={styles.actionIcon}>👥</span>
                <span className={styles.actionText}>
                  Управление пользователями
                </span>
              </button>

              <button
                onClick={() => handleNavigation("/admin/users/new")}
                className={styles.actionButton}
              >
                <span className={styles.actionIcon}>➕</span>
                <span className={styles.actionText}>Добавить пользователя</span>
              </button>

              <button onClick={fetchStats} className={styles.actionButton}>
                <span className={styles.actionIcon}>🔄</span>
                <span className={styles.actionText}>Обновить статистику</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
