import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./UsersList.module.css";
import adminApiService, { User, UserFilters } from "../../../services/adminApi";

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
    search: "",
    role: "",
    status: "",
  });

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const status = searchParams.get("status") || "";

    setFilters((prev) => ({
      ...prev,
      page,
      search,
      role,
      status,
    }));

    setCurrentPage(page);
  }, [searchParams]);

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getUsers(filters);
      setUsers(response.users);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError("Ошибка загрузки пользователей");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof UserFilters, value: string) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);

    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
  };

  const handleEditUser = (userId: string) => {
    navigate(`/admin/users/${userId}/edit`);
  };

  const handleViewUser = (userId: string) => {
    navigate(`/admin/users/${userId}`);
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    if (window.confirm("Вы уверены, что хотите изменить роль пользователя?")) {
      try {
        await adminApiService.updateUserRole(userId, newRole);
        fetchUsers(); // Обновляем список
      } catch (err) {
        alert("Ошибка изменения роли");
      }
    }
  };

  const handleChangeStatus = async (userId: string, newStatus: string) => {
    if (
      window.confirm("Вы уверены, что хотите изменить статус пользователя?")
    ) {
      try {
        await adminApiService.updateUserStatus(userId, newStatus);
        fetchUsers(); // Обновляем список
      } catch (err) {
        alert("Ошибка изменения статуса");
      }
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return styles.statusActive;
      case "blocked":
        return styles.statusBlocked;
      case "pending":
        return styles.statusPending;
      default:
        return "";
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "admin":
        return styles.roleAdmin;
      case "moderator":
        return styles.roleModerator;
      case "user":
        return styles.roleUser;
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Загрузка пользователей...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={fetchUsers} className={styles.retryButton}>
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className={styles.usersList}>
      <div className={styles.header}>
        <h1 className={styles.title}>Управление пользователями</h1>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className={styles.backButton}
        >
          Назад к дашборду
        </button>
      </div>

      {/* Фильтры */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <input
            type="text"
            placeholder="Поиск по email или имени..."
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <select
            value={filters.role || ""}
            onChange={(e) => handleFilterChange("role", e.target.value)}
            className={styles.select}
          >
            <option value="">Все роли</option>
            <option value="user">Пользователь</option>
            <option value="moderator">Модератор</option>
            <option value="admin">Администратор</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <select
            value={filters.status || ""}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className={styles.select}
          >
            <option value="">Все статусы</option>
            <option value="active">Активный</option>
            <option value="pending">Ожидание</option>
            <option value="blocked">Заблокирован</option>
          </select>
        </div>

        <button onClick={fetchUsers} className={styles.refreshButton}>
          Обновить
        </button>
      </div>

      {/* Таблица пользователей */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Пользователь</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Статус</th>
              <th>Дата регистрации</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className={styles.tableRow}>
                <td className={styles.idCell}>{user.id.substring(0, 8)}...</td>
                <td className={styles.userCell}>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                </td>
                <td className={styles.emailCell}>{user.email}</td>
                <td className={styles.roleCell}>
                  <span
                    className={`${styles.roleBadge} ${getRoleBadgeClass(user.role)}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className={styles.statusCell}>
                  <span
                    className={`${styles.statusBadge} ${getStatusBadgeClass(user.status)}`}
                  >
                    {user.status === "active"
                      ? "Активный"
                      : user.status === "pending"
                        ? "Ожидание"
                        : "Заблокирован"}
                  </span>
                </td>
                <td className={styles.dateCell}>
                  {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                </td>
                <td className={styles.actionsCell}>
                  <div className={styles.actions}>
                    <button
                      onClick={() => handleViewUser(user.id)}
                      className={styles.actionButton}
                      title="Просмотр"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => handleEditUser(user.id)}
                      className={styles.actionButton}
                      title="Редактировать"
                    >
                      ✏️
                    </button>
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleChangeRole(user.id, e.target.value)
                      }
                      className={styles.roleSelect}
                      title="Изменить роль"
                    >
                      <option value="user">Пользователь</option>
                      <option value="moderator">Модератор</option>
                      <option value="admin">Администратор</option>
                    </select>
                    <select
                      value={user.status}
                      onChange={(e) =>
                        handleChangeStatus(user.id, e.target.value)
                      }
                      className={styles.statusSelect}
                      title="Изменить статус"
                    >
                      <option value="active">Активный</option>
                      <option value="pending">Ожидание</option>
                      <option value="blocked">Заблокирован</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className={styles.emptyState}>
            <p>Пользователи не найдены</p>
          </div>
        )}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.pageButton}
          >
            Назад
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum = 1;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`${styles.pageButton} ${
                  currentPage === pageNum ? styles.activePage : ""
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.pageButton}
          >
            Вперед
          </button>

          <span className={styles.pageInfo}>
            Страница {currentPage} из {totalPages}
          </span>
        </div>
      )}
    </div>
  );
};

export default UsersList;
