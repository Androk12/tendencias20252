import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // <--- Importamos useNavigate

const Registro = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate(); // <--- Inicializamos useNavigate

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!nombre || !correo || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    if (!correo.includes("@")) {
      setError("Por favor, ingresa un correo válido.");
      return;
    }

    try {
      const response = await fetch("https://tendencias20252-td7g.onrender.com/registro/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: nombre,
          email: correo,
          password: password,
          role: "CLIENTE",
        }),
      });

      if (response.ok) {
        setSuccess("¡Usuario registrado exitosamente!");
        setNombre("");
        setCorreo("");
        setPassword("");
      } else {
        const data = await response.json();
        setError(data.detail || "Error al registrar el usuario.");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Registro de Usuario</h1>
      <form onSubmit={handleRegistro} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="correo">Correo Electrónico:</label>
          <input
            type="email"
            id="correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <button type="submit" style={styles.button}>
          Registrar Usuario
        </button>
      </form>

      {/* Botón constante para ir al login */}
      <button
        type="button"
        style={{ ...styles.button, marginTop: "15px", backgroundColor: "#28a745" }}
        onClick={() => navigate("/login")}
      >
        Ir al Login
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    marginBottom: "15px",
    textAlign: "left",
  },
  input: {
    width: "94%",
    padding: "10px",
    marginTop: "5px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "15px",
  },
  success: {
    color: "green",
    marginBottom: "15px",
  },
};

export default Registro;
