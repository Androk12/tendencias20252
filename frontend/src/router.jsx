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
import Entregas from "./pages/Entregas";
import ClienteProductos from "./pages/ClienteProductos";
import MisPedidos from "./pages/Mispedidos"; // ✅ Import corregido
import ProtectedRoute from "./components/ProtectedRoute";
import LogsView from "./components/LogsView"; // ✅ Nuevo import para logs

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <Login /> },
  { path: "/registro", element: <Registro /> },

  // Rutas generales protegidas
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
  {
    path: "/entregas",
    element: (
      <ProtectedRoute>
        <Entregas />
      </ProtectedRoute>
    ),
  },
  {
    path: "/logs", // ✅ Nueva ruta para logs
    element: (
      <ProtectedRoute>
        <LogsView />
      </ProtectedRoute>
    ),
  },

  // Rutas específicas para clientes
  {
    path: "/cliente/productos",
    element: <ClienteProductos />,
  },
  {
    path: "/cliente/mispedidos",
    element: <MisPedidos />,
  },
]);

export default router;

