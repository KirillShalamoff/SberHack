import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import Button from "../ui/button/button";
import { SvgIcon } from "../ui/SvgIcon/SvgIcon";
import styles from "./layout.module.css";

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_role");
    navigate("/login");
  };

  const isAuthenticated = !!localStorage.getItem("access_token");
  const userRole = localStorage.getItem("user_role") || "student";

  const navItems = [
    { path: "/dashboard", label: "Дашборд", icon: "home" },
    { path: "/projects", label: "Проекты", icon: "briefcase" },
    { path: "/kanban", label: "Канбан", icon: "trello" },
    { path: "/team", label: "Команда", icon: "users" },
    { path: "/profile", label: "Профиль", icon: "user" },
  ];

  // Скрываем панель навигации на страницах входа/регистрации
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className={styles.layout}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.logo} onClick={() => navigate("/")}>
            <SvgIcon name="rocket" width={32} height={32} color="#00A36F" />
            <span className={styles.logoText}>СберЛаб-НГУ</span>
          </div>

          {!isAuthPage && isAuthenticated && (
            <nav className={styles.nav}>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${styles.navLink} ${
                    location.pathname === item.path ? styles.active : ""
                  }`}
                >
                  <SvgIcon name={item.icon} width={20} height={20} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          )}

          <div className={styles.headerActions}>
            {isAuthenticated ? (
              <div className={styles.userMenu}>
                <span className={styles.userRole}>
                  {userRole === "student" ? "👨‍🎓 Студент" : "👨‍🏫 Ментор"}
                </span>
                <Button
                  variant="secondary"
                  onClick={handleLogout}
                  className={styles.logoutBtn}
                >
                  Выйти
                </Button>
              </div>
            ) : (
              <div className={styles.authButtons}>
                {location.pathname !== "/login" && (
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/login")}
                  >
                    Войти
                  </Button>
                )}
                {location.pathname !== "/register" && (
                  <Button
                    variant="primary"
                    onClick={() => navigate("/register")}
                  >
                    Регистрация
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className={styles.main}>
        <Outlet />
      </main>

      {/* Footer */}
      {!isAuthPage && (
        <footer className={styles.footer}>
          <div className={styles.footerContainer}>
            <div className={styles.footerSection}>
              <h4>СберЛаб-НГУ</h4>
              <p>Платформа для студенческих проектов</p>
              <p>© 2024 Все права защищены</p>
            </div>
            <div className={styles.footerSection}>
              <h4>Контакты</h4>
              <p>Email: support@sberlab-nsu.ru</p>
              <p>Телефон: +7 (383) 363-00-00</p>
              <p>НГУ, Новосибирск</p>
            </div>
            <div className={styles.footerSection}>
              <h4>Быстрые ссылки</h4>
              <Link to="/projects">Проекты</Link>
              <Link to="/team">Команда</Link>
              <Link to="/profile">Профиль</Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};
