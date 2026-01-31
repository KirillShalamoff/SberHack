import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import styles from "./AdminLayout.module.css";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.logo}>Админ-панель</h2>
        </div>

        <nav className={styles.nav}>
          <Link to="/admin/dashboard" className={styles.navLink}>
            <span className={styles.navIcon}>📊</span>
            <span className={styles.navText}>Дашборд</span>
          </Link>

          <Link to="/admin/users" className={styles.navLink}>
            <span className={styles.navIcon}>👥</span>
            <span className={styles.navText}>Пользователи</span>
          </Link>

          <Link to="/admin/analytics" className={styles.navLink}>
            <span className={styles.navIcon}>📈</span>
            <span className={styles.navText}>Аналитика</span>
          </Link>

          <Link to="/admin/settings" className={styles.navLink}>
            <span className={styles.navIcon}>⚙️</span>
            <span className={styles.navText}>Настройки</span>
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <span className={styles.logoutIcon}>🚪</span>
            <span className={styles.logoutText}>Выйти</span>
          </button>
        </div>
      </aside>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
