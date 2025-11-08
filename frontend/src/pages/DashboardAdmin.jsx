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

  // Obtener todos los usuarios
  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("/api/usuarios/", {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  // Eliminar usuario
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/usuarios/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar usuario");
    }
  };

  // Crear usuario
  const handleCreate = async () => {
    try {
      await axios.post("/api/usuarios/", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewUser({ username: "", email: "", password: "", role: "CLIENTE" });
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      alert("Error al crear usuario");
    }
  };

  // Iniciar edición de un usuario
  const startEditing = (user) => {
    setEditingUser(user.id);
    setEditData({
      username: user.username,
      email: user.email,
      role: user.role,
      password: "", // La contraseña se deja vacía para asignar nueva si se desea
    });
  };

  // Cancelar edición
  const cancelEditing = () => {
    setEditingUser(null);
    setEditData({ username: "", email: "", role: "", password: "" });
  };

  // Guardar cambios de edición
  const submitEdit = async () => {
    try {
      // Solo enviamos la contraseña si se escribió algo nuevo
      const payload = { ...editData };
      if (!payload.password) delete payload.password;

      await axios.patch(`/api/usuarios/${editingUser}/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingUser(null);
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar usuario");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: 50 }}>Cargando...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center", marginTop: 50 }}>{error}</p>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <Sidebar />

      <div style={styles.container}>
        <h1 style={styles.title}>Dashboard Admin</h1>

        {/* Formulario de creación */}
        <div style={styles.createForm}>
          <input
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            style={styles.input}
          />
          <input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            style={styles.input}
          />
          <input
            placeholder="Password"
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            style={styles.input}
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            style={styles.select}
          >
            <option value="ADMIN">ADMIN</option>
            <option value="CLIENTE">CLIENTE</option>
            <option value="VENDEDOR">VENDEDOR</option>
            <option value="REPARTIDOR">REPARTIDOR</option>
          </select>
          <button style={styles.createButton} onClick={handleCreate}>
            Crear
          </button>
        </div>

        {/* Tabla de usuarios */}
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Password</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} style={styles.row}>
                  <td>{u.id}</td>
                  <td>
                    {editingUser === u.id ? (
                      <input
                        value={editData.username}
                        onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                      />
                    ) : (
                      u.username
                    )}
                  </td>
                  <td>
                    {editingUser === u.id ? (
                      <input
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      />
                    ) : (
                      u.email
                    )}
                  </td>
                  <td>
                    {editingUser === u.id ? (
                      <select
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
                  <td>
                    {editingUser === u.id ? (
                      <input
                        type="password"
                        placeholder="Nueva contraseña"
                        value={editData.password}
                        onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                      />
                    ) : (
                      "••••••"
                    )}
                  </td>
                  <td>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(u.id)}>
                      Eliminar
                    </button>

                    {editingUser === u.id ? (
                      <>
                        <button style={styles.editBtn} onClick={submitEdit}>
                          Guardar
                        </button>
                        <button style={styles.deleteBtn} onClick={cancelEditing}>
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button style={styles.editBtn} onClick={() => startEditing(u)}>
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

const styles = {
  container: { flex: 1, padding: 30, backgroundColor: "#f4f6f8" },
  title: { marginBottom: 30, color: "#333", fontSize: 28 },
  createForm: { display: "flex", gap: 10, marginBottom: 30, flexWrap: "wrap", alignItems: "center" },
  input: { padding: 10, borderRadius: 5, border: "1px solid #ccc", minWidth: 180 },
  select: { padding: 10, borderRadius: 5, border: "1px solid #ccc" },
  createButton: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  table: { width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", borderRadius: 5 },
  row: { transition: "background 0.2s", cursor: "default", padding: 20 },
  deleteBtn: {
    marginRight: 5,
    padding: "5px 10px",
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  editBtn: {
    padding: "5px 10px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
};
