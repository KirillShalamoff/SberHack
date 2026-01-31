import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const isAuth = false; // Ваша логика проверки авторизации

  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
