import React, { useState, useEffect, useRef } from "react";
import axios from "../api/axios";
import "./Navbar.css";

export default function NavbarRepartidor() {
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
    localStorage.removeItem("refresh");
    window.location.href = "/login";
  };

  return (
    <header className="navbar" style={{ backgroundColor: "#c62828" }}>
      <div
        className="navbar-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
        }}
      >
        {/* Izquierda: Logo + Perfil */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div className="navbar-logo">
            <img
              src="/src/imagenes/logo.png"
              alt="Logo Delirio"
              className="navbar-img"
            />
            <span className="navbar-title">DELIRIO</span>
          </div>

          {/* Botón Perfil */}
          <div style={{ position: "relative" }} ref={perfilRef}>
            <button
              onClick={() => setPerfilOpen(!perfilOpen)}
              style={{
                padding: "5px 10px",
                backgroundColor: "#fff",
                color: "#c62828",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Perfil
            </button>

            {perfilOpen && userData && (
              <div
                className="perfil-dropdown left-dropdown"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  zIndex: 10,
                  backgroundColor: "#fff",
                  padding: "10px",
                  borderRadius: "5px",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
                  minWidth: "200px",
                }}
              >
                <div className="perfil-header" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <img
                    src="https://saberescincopuntocero.com/wp-content/uploads/2020/10/PERFIL-VACIO-1024x1024.png"
                    alt="Avatar"
                    style={{ width: "40px", borderRadius: "50%" }}
                  />
                  <span>{userData.username}</span>
                </div>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Rol:</strong> {userData.role}</p>
                <button
                  onClick={handleCerrarSesion}
                  style={{
                    backgroundColor: "#c62828",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Derecha vacío */}
        <div></div>
      </div>
    </header>
  );
}
