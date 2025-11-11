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

  const startEditing = (producto) => {
    setEditingProduct(producto.id);
    setEditData({
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      disponible: producto.disponible,
    });
  };

  const cancelEditing = () => {
    setEditingProduct(null);
    setEditData({ nombre: "", precio: 0, stock: 0, disponible: false });
  };

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

  if (loading) return <p style={{ textAlign: "center", marginTop: 50, color: "#fff" }}>Cargando...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center", marginTop: 50 }}>{error}</p>;

  // Estilos tipo glassmorphism
  const inputStyle = {
    padding: "10px 15px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.4)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    outline: "none",
    fontSize: 14,
    minWidth: 120,
  };

  const buttonStyle = {
    padding: "8px 15px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    backgroundColor: "#28a745",
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
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
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
        label {
          color: #fff;
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
        backgroundImage: "url('https://www.impulsonegocios.com/wp-content/uploads/2021/04/SUPERMERCADOS-Y-PROVEDORES.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      <CustomStyles />
      {/* Overlay oscuro semitransparente */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 0,
        }}
      />

      {/* Sidebar */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: 200,
        }}
      >
        <Sidebar textColor="#fff" />
      </div>

      {/* Contenido principal */}
      <div style={{ flex: 1, padding: 30, position: "relative", zIndex: 1 }}>
        <h1 style={{ marginBottom: 30, fontSize: 28, color: "#fff" }}>Inventario de Productos</h1>

        {/* Formulario de creación */}
        <div style={cardStyle}>
          <input
            placeholder="Nombre"
            value={newProduct.nombre}
            onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
            style={inputStyle}
          />
          <input
            placeholder="Precio"
            type="number"
            value={newProduct.precio}
            onChange={(e) => setNewProduct({ ...newProduct, precio: parseFloat(e.target.value) })}
            style={inputStyle}
          />
          <input
            placeholder="Stock"
            type="number"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
            style={inputStyle}
          />
          <label style={{ display: "flex", alignItems: "center", gap: 5 }}>
            Disponible
            <input
              type="checkbox"
              checked={newProduct.disponible}
              onChange={(e) => setNewProduct({ ...newProduct, disponible: e.target.checked })}
            />
          </label>
          <button style={buttonStyle} onClick={handleCreate}>
            Crear
          </button>
        </div>

        {/* Tabla de productos */}
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTdStyle}>ID</th>
                <th style={thTdStyle}>Nombre</th>
                <th style={thTdStyle}>Precio</th>
                <th style={thTdStyle}>Stock</th>
                <th style={thTdStyle}>Disponible</th>
                <th style={thTdStyle}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td style={thTdStyle}>{p.id}</td>
                  <td style={thTdStyle}>
                    {editingProduct === p.id ? (
                      <input
                        value={editData.nombre}
                        onChange={(e) => setEditData({ ...editData, nombre: e.target.value })}
                        style={inputStyle}
                      />
                    ) : (
                      p.nombre
                    )}
                  </td>
                  <td style={thTdStyle}>
                    {editingProduct === p.id ? (
                      <input
                        type="number"
                        value={editData.precio}
                        onChange={(e) => setEditData({ ...editData, precio: parseFloat(e.target.value) })}
                        style={inputStyle}
                      />
                    ) : (
                      p.precio
                    )}
                  </td>
                  <td style={thTdStyle}>
                    {editingProduct === p.id ? (
                      <input
                        type="number"
                        value={editData.stock}
                        onChange={(e) => setEditData({ ...editData, stock: parseInt(e.target.value) })}
                        style={inputStyle}
                      />
                    ) : (
                      p.stock
                    )}
                  </td>
                  <td style={thTdStyle}>
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
                  <td style={thTdStyle}>
                    <button
                      style={{ ...buttonStyle, backgroundColor: "#e74c3c", marginRight: 5 }}
                      onClick={() => handleDelete(p.id)}
                    >
                      Eliminar
                    </button>
                    {editingProduct === p.id ? (
                      <>
                        <button style={{ ...buttonStyle, backgroundColor: "#2ecc71" }} onClick={submitEdit}>
                          Guardar
                        </button>
                        <button style={{ ...buttonStyle, backgroundColor: "#95a5a6", marginLeft: 5 }} onClick={cancelEditing}>
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button style={{ ...buttonStyle, backgroundColor: "#3498db" }} onClick={() => startEditing(p)}>
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
