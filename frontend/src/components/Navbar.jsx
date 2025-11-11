import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import "./Navbar.css";

export default function Navbar({ carritoCount, toggleCarrito }) {
  const [userData, setUserData] = useState(null);
  const [perfilOpen, setPerfilOpen] = useState(false);
  const perfilRef = useRef();

  useEffect(() => {
    const usuarioId = localStorage.getItem("usuarioId");
    if (usuarioId) {
      axios.get(`/usuarios/${usuarioId}/`).then((res) => setUserData(res.data));
    }
  }, []);

  // Cerrar dropdown si se hace click afuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (perfilRef.current && !perfilRef.current.contains(event.target)) {
        setPerfilOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCerrarSesion = () => {
    localStorage.removeItem("usuarioId");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh"); // si existe
    window.location.href = "/login"; // redirige al login limpio
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img
            src="/src/imagenes/logo.png"
            alt="Logo Delirio"
            className="navbar-img"
          />
          <span className="navbar-title">DELIRIO</span>
        </div>

        <nav className="navbar-links">
          <Link to="/cliente/productos">Productos</Link>
          <Link to="/cliente/mispedidos">Mis Pedidos</Link>

          {/* Perfil */}
          <div className="perfil-wrapper" ref={perfilRef}>
            <button
              className="navbar-perfil-btn"
              onClick={() => setPerfilOpen(!perfilOpen)}
            >
              Perfil
            </button>

            {perfilOpen && userData && (
              <div className="perfil-dropdown left-dropdown">
                <div className="perfil-header">
                  <img
                    src="https://saberescincopuntocero.com/wp-content/uploads/2020/10/PERFIL-VACIO-1024x1024.png"
                    alt="Avatar"
                    className="perfil-avatar"
                  />
                  <span>{userData.username}</span>
                </div>
                <p>
                  <strong>Email:</strong> {userData.email}
                </p>
                <p>
                  <strong>Rol:</strong> {userData.role}
                </p>
                <button
                  className="cerrar-sesion-btn"
                  onClick={handleCerrarSesion}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Carrito a la derecha */}
        <button className="navbar-carrito-btn" onClick={toggleCarrito}>
          🛒 Mi Carrito ({carritoCount})
        </button>
      </div>
    </header>
  );
}
