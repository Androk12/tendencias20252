// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access"); // debe coincidir con tu login

  // ⚠️ también revisa que token no sea undefined o null
  if (!token) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
