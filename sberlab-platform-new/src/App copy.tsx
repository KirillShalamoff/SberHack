import React from "react";
import { mockProjects } from "./mocks/projects";
import "./App.css";
import { ProjectsGrid } from "./components/ui/cards/projectsGrid/projectsGrid";

const App = () => {
  const handleApply = (projectId: string | number) => {
    console.log("Подача заявки на проект:", projectId);
  };

  const handleArchive = (projectId: string | number) => {
    console.log("Архивировать проект:", projectId);
  };

  const handleDelete = (projectId: string | number) => {
    console.log("Удалить проект:", projectId);
  };

  const handleCardClick = (projectId: string | number) => {
    console.log("Открыть проект:", projectId);
  };

  return (
    <div className="app">
      <ProjectsGrid
        projects={mockProjects}
        onApply={handleApply}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onCardClick={handleCardClick}
      />
    </div>
  );
};

export default App;
