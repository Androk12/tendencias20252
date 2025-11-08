// src/pages/Perfil.jsx
import { useEffect, useState } from "react";
import axios from "../api/axios";
import LogoutButton from "../components/LogoutButton";

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem("access"); // 👈 guardaste el token tras login
        const res = await axios.get("/usuarios/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuario(res.data[0]); // el cliente solo ve su propio perfil
      } catch (err) {
        console.error(err);
        setError("Error al cargar el perfil");
      }
    };

    fetchPerfil();
  }, []);

  if (error) return <p>{error}</p>;
  if (!usuario) return <p>Cargando perfil...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>
      <p><strong>Nombre:</strong> {usuario.nombre}</p>
      <p><strong>Email:</strong> {usuario.email}</p>
      <p><strong>Rol:</strong> {usuario.role}</p>
    </div>
  );

  return (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>
    <p><strong>Nombre:</strong> {usuario.nombre}</p>
    <p><strong>Email:</strong> {usuario.email}</p>
    <p><strong>Rol:</strong> {usuario.role}</p>

    <LogoutButton /> {/* 👈 Botón de salida segura */}
  </div>
);
}
