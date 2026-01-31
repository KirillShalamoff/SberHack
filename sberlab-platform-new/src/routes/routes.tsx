import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./privateRoute";
import AdminLayout from "../components/adminLayout";

const LoginPage = lazy(() => import("../pages/loginPage/loginPage"));
const RegisterPage = lazy(() => import("../pages/registerPage/registerPage"));
const AdminDashboard = lazy(() => import("../pages/admin/dashboard/dashboard"));
const UsersList = lazy(() => import("../pages/admin/users/usersList"));
const UserDetail = lazy(() => import("../pages/admin/userDetail/userDetail"));

const ProjectsPage = lazy(() => import("../pages/projectsPage/projectsPage"));

const routes = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/projects",
    element: <ProjectsPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/admin",
    element: (
      //   <PrivateRoute>
      <AdminLayout />
      //   </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "users",
        children: [
          {
            index: true,
            element: <UsersList />,
          },
          {
            path: ":id",
            element: <UserDetail />,
          },
        ],
      },
    ],
  },
]);

export { routes };
