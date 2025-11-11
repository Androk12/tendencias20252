import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  // Tomamos el rol del usuario desde localStorage
  const role = localStorage.getItem("usuarioRole"); 
  const usuarioId = localStorage.getItem("usuarioId");

  // Si no está logueado, redirigimos al login
  if (!usuarioId) {
    return <Navigate to="/login" replace />;
  }

  // Si se especifican roles permitidos y el rol no coincide, redirigimos
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }
  // Si pasa las validaciones, mostramos el componente
  return children;
}
