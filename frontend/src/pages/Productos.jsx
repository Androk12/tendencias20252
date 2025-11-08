import { useEffect, useState } from "react";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newProduct, setNewProduct] = useState({ nombre: "", precio: 0, stock: 0, disponible: false });
  const [editingProduct, setEditingProduct] = useState(null);
  const [editData, setEditData] = useState({ nombre: "", precio: 0, stock: 0, disponible: false });

  const token = localStorage.getItem("access");

  // Obtener productos
  const fetchProductos = async () => {
    try {
      const response = await axios.get("/api/productos/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductos(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los productos.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Crear producto
  const handleCreate = async () => {
    try {
      await axios.post("/api/productos/", newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewProduct({ nombre: "", precio: 0, stock: 0, disponible: false });
      fetchProductos();
    } catch (err) {
      console.error(err);
      alert("Error al crear producto");
    }
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/productos/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProductos();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar producto");
    }
  };

  // Iniciar edición
  const startEditing = (producto) => {
    setEditingProduct(producto.id);
    setEditData({
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      disponible: producto.disponible,
    });
  };

  // Cancelar edición
  const cancelEditing = () => {
    setEditingProduct(null);
    setEditData({ nombre: "", precio: 0, stock: 0, disponible: false });
  };

  // Guardar cambios
  const submitEdit = async () => {
    try {
      await axios.patch(`/api/productos/${editingProduct}/`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingProduct(null);
      fetchProductos();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar producto");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: 50 }}>Cargando...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center", marginTop: 50 }}>{error}</p>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: 30, backgroundColor: "#f4f6f8" }}>
        <h1 style={{ marginBottom: 30, color: "#333", fontSize: 28 }}>Inventario de Productos</h1>

        {/* Formulario de creación */}
        <div style={{ display: "flex", gap: 10, marginBottom: 30, flexWrap: "wrap", alignItems: "center" }}>
          <input
            placeholder="Nombre"
            value={newProduct.nombre}
            onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
            style={styles.input}
          />
          <input
            placeholder="Precio"
            type="number"
            value={newProduct.precio}
            onChange={(e) => setNewProduct({ ...newProduct, precio: parseFloat(e.target.value) })}
            style={styles.input}
          />
          <input
            placeholder="Stock"
            type="number"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
            style={styles.input}
          />
          <label style={{ display: "flex", alignItems: "center", gap: 5 }}>
            Disponible
            <input
              type="checkbox"
              checked={newProduct.disponible}
              onChange={(e) => setNewProduct({ ...newProduct, disponible: e.target.checked })}
            />
          </label>
          <button style={styles.createButton} onClick={handleCreate}>Crear</button>
        </div>

        {/* Tabla de productos */}
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Disponible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id} style={styles.row}>
                  <td>{p.id}</td>
                  <td>
                    {editingProduct === p.id ? (
                      <input
                        value={editData.nombre}
                        onChange={(e) => setEditData({ ...editData, nombre: e.target.value })}
                      />
                    ) : (
                      p.nombre
                    )}
                  </td>
                  <td>
                    {editingProduct === p.id ? (
                      <input
                        type="number"
                        value={editData.precio}
                        onChange={(e) => setEditData({ ...editData, precio: parseFloat(e.target.value) })}
                      />
                    ) : (
                      p.precio
                    )}
                  </td>
                  <td>
                    {editingProduct === p.id ? (
                      <input
                        type="number"
                        value={editData.stock}
                        onChange={(e) => setEditData({ ...editData, stock: parseInt(e.target.value) })}
                      />
                    ) : (
                      p.stock
                    )}
                  </td>
                  <td>
                    {editingProduct === p.id ? (
                      <input
                        type="checkbox"
                        checked={editData.disponible}
                        onChange={(e) => setEditData({ ...editData, disponible: e.target.checked })}
                      />
                    ) : (
                      p.disponible ? "Sí" : "No"
                    )}
                  </td>
                  <td>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(p.id)}>Eliminar</button>
                    {editingProduct === p.id ? (
                      <>
                        <button style={styles.editBtn} onClick={submitEdit}>Guardar</button>
                        <button style={styles.deleteBtn} onClick={cancelEditing}>Cancelar</button>
                      </>
                    ) : (
                      <button style={styles.editBtn} onClick={() => startEditing(p)}>Editar</button>
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
  input: { padding: 10, borderRadius: 5, border: "1px solid #ccc", minWidth: 120 },
  createButton: { padding: "10px 20px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", borderRadius: 5 },
  row: { transition: "background 0.2s", cursor: "default", padding: 20 },
  deleteBtn: { marginRight: 5, padding: "5px 10px", backgroundColor: "#e74c3c", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer" },
  editBtn: { padding: "5px 10px", backgroundColor: "#3498db", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer" },
};
