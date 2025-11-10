import { useEffect, useState } from "react";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";

export default function DashboardAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "CLIENTE" });
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({ username: "", email: "", role: "", password: "" });

  const token = localStorage.getItem("access");

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("/api/usuarios/", { headers: { Authorization: `Bearer ${token}` } });
      setUsuarios(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los usuarios.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/usuarios/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar usuario");
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post("/api/usuarios/", newUser, { headers: { Authorization: `Bearer ${token}` } });
      setNewUser({ username: "", email: "", password: "", role: "CLIENTE" });
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      alert("Error al crear usuario");
    }
  };

  const startEditing = (user) => {
    setEditingUser(user.id);
    setEditData({
      username: user.username,
      email: user.email,
      role: user.role,
      password: "",
    });
  };

  const cancelEditing = () => {
    setEditingUser(null);
    setEditData({ username: "", email: "", role: "", password: "" });
  };

  const submitEdit = async () => {
    try {
      const payload = { ...editData };
      if (!payload.password) delete payload.password;
      await axios.patch(`/api/usuarios/${editingUser}/`, payload, { headers: { Authorization: `Bearer ${token}` } });
      setEditingUser(null);
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar usuario");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: 50, color: "#fff" }}>Cargando...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center", marginTop: 50 }}>{error}</p>;

  // Estilos modernos tipo "glassmorphism"
  const inputStyle = {
    padding: "10px 15px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.4)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    outline: "none",
    fontSize: 14,
    minWidth: 180,
  };

  const selectStyle = {
    ...inputStyle,
    appearance: "none",
    cursor: "pointer",
  };

  const buttonStyle = {
    padding: "8px 15px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    backgroundColor: "#3498db",
    color: "#fff",
    transition: "0.3s",
  };

  const cardStyle = {
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(8px)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    color: "#fff",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(8px)",
    borderRadius: 10,
    overflow: "hidden",
    color: "#fff",
  };

  const thTdStyle = {
    padding: "12px 10px",
    borderBottom: "1px solid rgba(255,255,255,0.3)",
    textAlign: "left",
  };

  const CustomStyles = () => (
    <style>
      {`
        input::placeholder,
        select::placeholder {
          color: #fff !important;
          opacity: 1;
        }
      `}
    </style>
  );

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundImage:
          "url('https://checkbits.com.br/wp-content/uploads/2023/06/O-que-e-gestao-de-supermercados.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      <CustomStyles />

      {/* Overlay oscuro */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 0,
        }}
      />

      {/* Sidebar */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          backgroundColor: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(8px)",
          padding: 15,
          width: 200,
          boxShadow: "2px 0 5px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          gap: 15,
        }}
      >
        <Sidebar textColor="#fff" />
      </div>

      {/* Contenido principal */}
      <div style={{ flex: 1, padding: 30, position: "relative", zIndex: 1 }}>
        <h1 style={{ marginBottom: 30, fontSize: 28, color: "#fff" }}>Dashboard Admin</h1>

        <div style={cardStyle}>
          <input
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            style={inputStyle}
          />
          <input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            style={inputStyle}
          />
          <input
            placeholder="Password"
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            style={inputStyle}
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            style={selectStyle}
          >
            <option value="ADMIN">ADMIN</option>
            <option value="CLIENTE">CLIENTE</option>
            <option value="VENDEDOR">VENDEDOR</option>
            <option value="REPARTIDOR">REPARTIDOR</option>
          </select>
          <button style={buttonStyle} onClick={handleCreate}>
            Crear
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTdStyle}>ID</th>
                <th style={thTdStyle}>Usuario</th>
                <th style={thTdStyle}>Email</th>
                <th style={thTdStyle}>Rol</th>
                <th style={thTdStyle}>Password</th>
                <th style={thTdStyle}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td style={thTdStyle}>{u.id}</td>
                  <td style={thTdStyle}>
                    {editingUser === u.id ? (
                      <input
                        style={inputStyle}
                        value={editData.username}
                        onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                      />
                    ) : (
                      u.username
                    )}
                  </td>
                  <td style={thTdStyle}>
                    {editingUser === u.id ? (
                      <input
                        style={inputStyle}
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      />
                    ) : (
                      u.email
                    )}
                  </td>
                  <td style={thTdStyle}>
                    {editingUser === u.id ? (
                      <select
                        style={selectStyle}
                        value={editData.role}
                        onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="CLIENTE">CLIENTE</option>
                        <option value="VENDEDOR">VENDEDOR</option>
                        <option value="REPARTIDOR">REPARTIDOR</option>
                      </select>
                    ) : (
                      u.role
                    )}
                  </td>
                  <td style={thTdStyle}>
                    {editingUser === u.id ? (
                      <input
                        type="password"
                        placeholder="Nueva contraseña"
                        style={inputStyle}
                        value={editData.password}
                        onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                      />
                    ) : (
                      "••••••"
                    )}
                  </td>
                  <td style={thTdStyle}>
                    <button
                      style={{ ...buttonStyle, backgroundColor: "#e74c3c", marginRight: 5 }}
                      onClick={() => handleDelete(u.id)}
                    >
                      Eliminar
                    </button>
                    {editingUser === u.id ? (
                      <>
                        <button style={{ ...buttonStyle, backgroundColor: "#2ecc71" }} onClick={submitEdit}>
                          Guardar
                        </button>
                        <button style={{ ...buttonStyle, backgroundColor: "#95a5a6", marginLeft: 5 }} onClick={cancelEditing}>
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button style={{ ...buttonStyle, backgroundColor: "#3498db" }} onClick={() => startEditing(u)}>
                        Editar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
