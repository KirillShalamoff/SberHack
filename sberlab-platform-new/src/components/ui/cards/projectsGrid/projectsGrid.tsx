import React from "react";
import styles from "./projectsGrid.module.css";
import { ProjectCardProps } from "../../../../interface/types";
import { ProjectCard } from "../projectCard";
import Button from "../../button/button";
import { SvgIcon } from "../../SvgIcon/SvgIcon";

interface ProjectsGridProps {
  projects: ProjectCardProps[];
  onApply?: (id: string | number) => void;
  onArchive?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onCardClick?: (id: string | number) => void;
  onCreateProject?: () => void; // Новая опция для создания проекта
  showCreateButton?: boolean; // Контроль видимости кнопки
  title?: string; // Опциональный заголовок
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({
  projects,
  onApply,
  onArchive,
  onDelete,
  onCardClick,
  onCreateProject,
  showCreateButton = false,
  title,
}) => {
  return (
    <div className={styles.container}>
      {/* Заголовок и кнопка создания проекта */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          {showCreateButton && onCreateProject && (
            <Button
              variant="primary"
              onClick={onCreateProject}
              className={styles.createButton}
            >
              <SvgIcon name="plus" width={16} height={16} />
              Создать проект
            </Button>
          )}
        </div>
      </div>

      {/* Сетка проектов */}
      <div className={styles.grid}>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            {...project}
            onApply={onApply}
            onArchive={onArchive}
            onDelete={onDelete}
            onClick={onCardClick}
          />
        ))}
      </div>

      {projects.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIllustration}>
            <SvgIcon
              name="folder-plus"
              width={64}
              height={64}
              color="#94a3b8"
            />
          </div>

          {/* {showCreateButton && onCreateProject && ( */}
          <Button
            variant="primary"
            onClick={onCreateProject}
            className={styles.emptyCreateButton}
          >
            <SvgIcon name="plus" width={16} height={16} />
            Создать проект
          </Button>
          {/* )} */}
        </div>
      )}
    </div>
  );
};
