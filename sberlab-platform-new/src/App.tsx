import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/header/header";
import RegistrationPage from "./pages/registerPage/registerPage";
import { LoginPage } from "./pages/loginPage/loginPage";
import DashboardPage from "./pages/dashboardPage/dashboardPage";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/kanban" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
