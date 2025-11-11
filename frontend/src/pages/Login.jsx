import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios"; // tu instancia de Axios con interceptores

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Limpiar tokens viejos
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("usuarioId");

      // Petición de login
      const { data } = await axios.post("/api/token/", { username, password });

      // Guardar access y refresh tokens
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      // Obtener datos del usuario
      const meResponse = await axios.get("/api/usuarios/me/");

      // Guardar el id del usuario logueado
      localStorage.setItem("usuarioId", meResponse.data.id);

      // Redirigir según rol
      redirectByRole(meResponse.data.role);

    } catch (err) {
      console.error(err);
      setError("Credenciales inválidas o error en el servidor.");
    }
  };

  const redirectByRole = (role) => {
    switch (role) {
      case "ADMIN":
        navigate("/dashboardAdmin");
        break;
      case "CLIENTE":
        navigate("/cliente/productos");
        break;
      case "VENDEDOR":
        navigate("/DashboardVendedor");
        break;
      case "REPARTIDOR":
        navigate("/dashboardRepartidor");
        break;
      default:
        navigate("/");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      axios
        .get("/api/usuarios/me/")
        .then(res => {
          localStorage.setItem("usuarioId", res.data.id); // aseguramos guardar el id
          redirectByRole(res.data.role);
        })
        .catch(() => {
          // token inválido o expirado
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          localStorage.removeItem("usuarioId");
        });
    }
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Iniciar Sesión</h1>
      <form onSubmit={handleLogin} style={styles.form}>
        <div style={styles.inputGroup}>
          <label>Usuario:</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>Entrar</button>
      </form>

      <p style={styles.registerText}>
        ¿No tienes cuenta?{" "}
        <Link to="/Registro" style={styles.registerLink}>
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: "50px auto",
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 8,
    textAlign: "center",
    backgroundColor: "#f9f9f9",
  },
  title: { marginBottom: 20, color: "#333" },
  form: { display: "flex", flexDirection: "column" },
  inputGroup: { marginBottom: 15, textAlign: "left" },
  input: {
    width: "95%",
    padding: 10,
    marginTop: 5,
    border: "1px solid #ccc",
    borderRadius: 4,
  },
  button: {
    padding: 10,
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  error: { color: "red", marginBottom: 15 },
  registerText: { marginTop: 15, fontSize: 14, color: "#333" },
  registerLink: { color: "#007bff", textDecoration: "none", fontWeight: "bold" },
};
