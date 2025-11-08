// src/router.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Productos from "./pages/Productos";
import Pedidos from "./pages/Pedidos";
import Perfil from "./pages/Perfil";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardVendedor from "./pages/DashboardVendedor";
import DashboardRepartidor from "./pages/DashboardRepartidor";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/registro",
    element: <Registro />,
  },
  {
    path: "/productos",
    element: (
      <ProtectedRoute>
        <Productos />
      </ProtectedRoute>
    ),
  },
  {
    path: "/pedidos",
    element: (
      <ProtectedRoute>
        <Pedidos />
      </ProtectedRoute>
    ),
  },
  {
    path: "/perfil",
    element: (
      <ProtectedRoute>
        <Perfil />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboardAdmin",
    element: (
      <ProtectedRoute>
        <DashboardAdmin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboardVendedor",
    element: (
      <ProtectedRoute>
        <DashboardVendedor />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboardRepartidor",
    element: (
      <ProtectedRoute>
        <DashboardRepartidor />
      </ProtectedRoute>
    ),
  },
]);

export default router;
