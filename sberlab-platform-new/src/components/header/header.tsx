import React from "react";
import { Link } from "react-router-dom";
import styles from "./header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.content}>
          <nav className={styles.nav}>
            <Link to="/projects" className={styles.navLinkActive}>
              Каталог проектов
            </Link>
            <Link to="/login" className={styles.navLink}>
              Вход
            </Link>
            <Link to="/register" className={styles.navLink}>
              Регистрация
            </Link>
            <Link to="/login" className={styles.navLink}>
              События
            </Link>
            <Link to="/projects" className={styles.navLink}>
              Проекты
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
