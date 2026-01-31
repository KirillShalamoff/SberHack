import React from "react";
import styles from "./tag.module.css";

interface TagProps {
  children: React.ReactNode;
  variant?: "tech" | "status" | "category";
  size?: "small" | "medium";
  className?: string;
}

export const Tag: React.FC<TagProps> = ({
  children,
  variant = "tech",
  size = "medium",
  className = "",
}) => {
  return (
    <span
      className={`${styles.tag} ${styles[variant]} ${styles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
