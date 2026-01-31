import React from "react";
import styles from "./projectsGrid.module.css";
import { ProjectCardProps } from "../../../../interface/types";
import { ProjectCard } from "../projectCard";

interface ProjectsGridProps {
  projects: ProjectCardProps[];
  onApply?: (id: string | number) => void;
  onArchive?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onCardClick?: (id: string | number) => void;
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({
  projects,
  onApply,
  onArchive,
  onDelete,
  onCardClick,
}) => {
  return (
    <div className={styles.container}>
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
          <h3>Проектов пока нет</h3>
          <p>Будьте первым, кто создаст проект!</p>
        </div>
      )}
    </div>
  );
};
