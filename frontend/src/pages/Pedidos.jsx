import { useEffect, useState } from "react";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPedido, setNewPedido] = useState({
    cliente: "",
    productos: [],
    direccion: "",
    estado: "PENDIENTE",
    total: 0,
    descripcion: "",
  });

  const token = localStorage.getItem("access");

  // Obtener datos iniciales
  const fetchData = async () => {
    try {
      const [pedRes, userRes, prodRes] = await Promise.all([
        axios.get("/api/pedidos/", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/api/usuarios/", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/api/productos/", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setPedidos(pedRes.data);
      setUsuarios(userRes.data);
      setProductos(prodRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Error cargando datos");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calcular total según los productos seleccionados
  const calculateTotal = () => {
    return newPedido.productos
      .map(pid => productos.find(p => p.id === pid)?.precio || 0)
      .reduce((a, b) => a + b, 0);
  };

  // Crear pedido
  const handleCreate = async () => {
    try {
      const pedidoData = {
        cliente: newPedido.cliente,
        direccion: newPedido.direccion,
        estado: newPedido.estado,
        total: calculateTotal(),
        descripcion: newPedido.descripcion,
      };

      await axios.post("/api/pedidos/", pedidoData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewPedido({ cliente: "", productos: [], direccion: "", estado: "PENDIENTE", total: 0, descripcion: "" });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error al crear pedido");
    }
  };

  // Eliminar pedido
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/pedidos/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar pedido");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: 50 }}>Cargando...</p>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 30, backgroundColor: "#f4f6f8" }}>
        <h1 style={{ marginBottom: 30, color: "#333", fontSize: 28 }}>Pedidos</h1>

        {/* Formulario de creación */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 30 }}>
          <select
            value={newPedido.cliente}
            onChange={(e) => setNewPedido({ ...newPedido, cliente: e.target.value })}
          >
            <option value="">Selecciona un usuario</option>
            {usuarios.map(u => (
              <option key={u.id} value={u.id}>{u.username}</option>
            ))}
          </select>

          <label>Productos:</label>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {productos.map(p => (
              <label key={p.id}>
                <input
                  type="checkbox"
                  value={p.id}
                  checked={newPedido.productos.includes(p.id)}
                  onChange={(e) => {
                    const id = parseInt(e.target.value);
                    if (e.target.checked) {
                      setNewPedido({ ...newPedido, productos: [...newPedido.productos, id] });
                    } else {
                      setNewPedido({ ...newPedido, productos: newPedido.productos.filter(pid => pid !== id) });
                    }
                  }}
                />
                {p.nombre} (${p.precio})
              </label>
            ))}
          </div>

          <input
            placeholder="Dirección"
            value={newPedido.direccion}
            onChange={(e) => setNewPedido({ ...newPedido, direccion: e.target.value })}
          />

          <select
            value={newPedido.estado}
            onChange={(e) => setNewPedido({ ...newPedido, estado: e.target.value })}
          >
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="EN_PROCESO">EN_PROCESO</option>
            <option value="ENTREGADO">ENTREGADO</option>
          </select>

          <textarea
            placeholder="Descripción (opcional)"
            value={newPedido.descripcion}
            onChange={(e) => setNewPedido({ ...newPedido, descripcion: e.target.value })}
          />

          <button onClick={handleCreate}>Crear Pedido</button>
        </div>

        {/* Tabla de pedidos */}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Productos</th>
              <th>Dirección</th>
              <th>Estado</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.cliente?.username}</td>
                <td>{p.productos?.map(prod => prod.nombre).join(", ")}</td>
                <td>{p.direccion}</td>
                <td>{p.estado}</td>
                <td>${p.total}</td>
                <td>
                  <button onClick={() => handleDelete(p.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
