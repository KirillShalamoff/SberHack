import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./UserDetail.module.css";
import adminApiService, { User } from "../../../api/admin";

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});

  useEffect(() => {
    if (id) {
      fetchUser(id);
    }
  }, [id]);

  const fetchUser = async (userId: string) => {
    try {
      setLoading(true);
      const data = await adminApiService.getUserById(userId);
      setUser(data);
      setFormData({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });
    } catch (err) {
      setError("Пользователь не найден");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!id || !user) return;

    try {
      await adminApiService.updateUser(id, formData);
      await fetchUser(id);
      setIsEditing(false);
    } catch (err) {
      alert("Ошибка сохранения");
    }
  };

  const handleChangeRole = async (newRole: string) => {
    if (!id) return;

    if (window.confirm(`Изменить роль на "${newRole}"?`)) {
      try {
        await adminApiService.updateUserRole(id, newRole);
        await fetchUser(id);
      } catch (err) {
        alert("Ошибка изменения роли");
      }
    }
  };

  const handleChangeStatus = async (newStatus: string) => {
    if (!id) return;

    if (window.confirm(`Изменить статус на "${newStatus}"?`)) {
      try {
        await adminApiService.updateUserStatus(id, newStatus);
        await fetchUser(id);
      } catch (err) {
        alert("Ошибка изменения статуса");
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Загрузка данных пользователя...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={styles.error}>
        <p>{error || "Пользователь не найден"}</p>
        <button
          onClick={() => navigate("/admin/users")}
          className={styles.backButton}
        >
          Вернуться к списку
        </button>
      </div>
    );
  }

  return (
    <div className={styles.userDetail}>
      <div className={styles.header}>
        <button
          onClick={() => navigate("/admin/users")}
          className={styles.backButton}
        >
          ← Назад к списку
        </button>
        <h1 className={styles.title}>Профиль пользователя</h1>
        <div className={styles.headerActions}>
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className={styles.cancelButton}
              >
                Отмена
              </button>
              <button onClick={handleSave} className={styles.saveButton}>
                Сохранить
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className={styles.editButton}
            >
              Редактировать
            </button>
          )}
        </div>
      </div>

      <div className={styles.content}>
        {/* Основная информация */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Основная информация</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label className={styles.label}>ID пользователя</label>
              <p className={styles.value}>{user.id}</p>
            </div>

            <div className={styles.infoItem}>
              <label className={styles.label}>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={styles.input}
                />
              ) : (
                <p className={styles.value}>{user.email}</p>
              )}
            </div>

            <div className={styles.infoItem}>
              <label className={styles.label}>Имя</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.firstName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className={styles.input}
                />
              ) : (
                <p className={styles.value}>{user.firstName}</p>
              )}
            </div>

            <div className={styles.infoItem}>
              <label className={styles.label}>Фамилия</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.lastName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className={styles.input}
                />
              ) : (
                <p className={styles.value}>{user.lastName}</p>
              )}
            </div>

            <div className={styles.infoItem}>
              <label className={styles.label}>Дата регистрации</label>
              <p className={styles.value}>
                {new Date(user.createdAt).toLocaleDateString("ru-RU")}
              </p>
            </div>

            <div className={styles.infoItem}>
              <label className={styles.label}>Последний вход</label>
              <p className={styles.value}>
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleDateString("ru-RU")
                  : "Никогда"}
              </p>
            </div>
          </div>
        </div>

        {/* Управление доступом */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Управление доступом</h2>
          <div className={styles.accessGrid}>
            <div className={styles.accessItem}>
              <label className={styles.label}>Роль</label>
              <div className={styles.accessControl}>
                <span
                  className={`${styles.badge} ${
                    user.role === "admin"
                      ? styles.badgeAdmin
                      : user.role === "moderator"
                        ? styles.badgeModerator
                        : styles.badgeUser
                  }`}
                >
                  {user.role === "admin"
                    ? "Администратор"
                    : user.role === "moderator"
                      ? "Модератор"
                      : "Пользователь"}
                </span>
                <select
                  value={user.role}
                  onChange={(e) => handleChangeRole(e.target.value)}
                  className={styles.select}
                >
                  <option value="user">Пользователь</option>
                  <option value="moderator">Модератор</option>
                  <option value="admin">Администратор</option>
                </select>
              </div>
            </div>

            <div className={styles.accessItem}>
              <label className={styles.label}>Статус</label>
              <div className={styles.accessControl}>
                <span
                  className={`${styles.badge} ${
                    user.status === "active"
                      ? styles.badgeActive
                      : user.status === "pending"
                        ? styles.badgePending
                        : styles.badgeBlocked
                  }`}
                >
                  {user.status === "active"
                    ? "Активный"
                    : user.status === "pending"
                      ? "Ожидание"
                      : "Заблокирован"}
                </span>
                <select
                  value={user.status}
                  onChange={(e) => handleChangeStatus(e.target.value)}
                  className={styles.select}
                >
                  <option value="active">Активный</option>
                  <option value="pending">Ожидание</option>
                  <option value="blocked">Заблокирован</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Статистика</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Проектов создано</span>
              <span className={styles.statValue}>
                {user.projectsCount || 0}
              </span>
            </div>
            {/* Можно добавить больше статистики */}
          </div>
        </div>

        {/* Опасная зона */}
        <div className={styles.dangerZone}>
          <h2 className={styles.dangerTitle}>Опасная зона</h2>
          <div className={styles.dangerActions}>
            {user.status === "blocked" ? (
              <button
                onClick={() => handleChangeStatus("active")}
                className={styles.unblockButton}
              >
                Разблокировать пользователя
              </button>
            ) : (
              <button
                onClick={() => handleChangeStatus("blocked")}
                className={styles.blockButton}
              >
                Заблокировать пользователя
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
