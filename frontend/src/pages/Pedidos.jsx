import { useEffect, useState } from "react";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";

const CustomStyles = () => (
  <style>
    {`
      input::placeholder,
      textarea::placeholder {
        color: #fff !important;
        opacity: 1;
      }
    `}
  </style>
);

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newPedido, setNewPedido] = useState({
    cliente: "",
    productos: [],
    direccion: "",
    descripcion: "",
  });

  const token = localStorage.getItem("access");

  const fetchData = async () => {
    try {
      const [pedRes, userRes, prodRes, detRes, entRes] = await Promise.all([
        axios.get("pedidos/", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("usuarios/", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("productos/", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("detalles-pedido/", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("entregas/", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const pedidosCompletos = pedRes.data.map((pedido) => {
        const detallesPedido = detRes.data.filter((d) => d.pedido === pedido.id);
        const entregaPedido = entRes.data.find((e) => e.pedido === pedido.id);
        const cliente = userRes.data.find((u) => u.id === pedido.cliente);

        return {
          ...pedido,
          cliente_nombre: cliente ? cliente.username : "Desconocido",
          detalles: detallesPedido.map((d) => ({
            ...d,
            producto: prodRes.data.find((p) => p.id === d.producto),
          })),
          entrega: entregaPedido || null,
        };
      });

      setPedidos(pedidosCompletos);
      setUsuarios(userRes.data);
      setProductos(prodRes.data);
      setDetalles(detRes.data);
      setEntregas(entRes.data);
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

  const calculateTotal = () =>
    newPedido.productos
      .map((pid) => Number(productos.find((p) => p.id === pid)?.precio) || 0)
      .reduce((a, b) => a + b, 0);

  const handleCreate = async () => {
    try {
      const pedidoRes = await axios.post(
        "pedidos/",
        {
          cliente: newPedido.cliente,
          direccion: newPedido.direccion,
          total: calculateTotal(),
          descripcion: newPedido.descripcion,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const pedidoId = pedidoRes.data.id;

      for (const prodId of newPedido.productos) {
        await axios.post(
          "detalles-pedido/",
          { pedido: pedidoId, producto: prodId, cantidad: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setNewPedido({ cliente: "", productos: [], direccion: "", descripcion: "" });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error al crear pedido");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`pedidos/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar pedido");
    }
  };

  const handleAsignarEntrega = async (pedidoId) => {
    try {
      await axios.post(
        "entregas/",
        { pedido: pedidoId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error al asignar entrega");
    }
  };

  if (loading)
    return <p style={{ textAlign: "center", marginTop: 50, color: "#fff" }}>Cargando...</p>;

  const inputStyle = {
    padding: "10px 15px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.4)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    outline: "none",
    width: "100%",
    fontSize: 14,
  };

  const selectStyle = {
    ...inputStyle,
    color: "#000", // texto legible
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
  };

  const thTdStyle = {
    padding: "12px 10px",
    borderBottom: "1px solid rgba(255,255,255,0.3)",
    textAlign: "left",
    color: "#fff",
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundImage:
          "url('https://img.freepik.com/vector-premium/mi-lista-pedidos-plana-ilustracion-diseno-moderno_566886-92.jpg?w=2000')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
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
        <Sidebar />
      </div>

      {/* Contenido principal */}
      <div style={{ flex: 1, padding: 30, position: "relative", zIndex: 1, color: "#fff" }}>
        <CustomStyles />
        <h1 style={{ marginBottom: 30, fontSize: 28 }}>Gestión de Pedidos</h1>

        <div style={cardStyle}>
          <select
            style={selectStyle}
            value={newPedido.cliente}
            onChange={(e) => setNewPedido({ ...newPedido, cliente: e.target.value })}
          >
            <option value="">Selecciona un cliente</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id} style={{ color: "#000" }}>
                {u.username}
              </option>
            ))}
          </select>

          <label>Productos:</label>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {productos.map((p) => (
              <label key={p.id} style={{ display: "flex", alignItems: "center", gap: 5, color: "#fff" }}>
                <input
                  type="checkbox"
                  value={p.id}
                  checked={newPedido.productos.includes(p.id)}
                  onChange={(e) => {
                    const id = parseInt(e.target.value);
                    setNewPedido({
                      ...newPedido,
                      productos: e.target.checked
                        ? [...newPedido.productos, id]
                        : newPedido.productos.filter((pid) => pid !== id),
                    });
                  }}
                />
                {p.nombre} (${p.precio})
              </label>
            ))}
          </div>

          <input
            style={inputStyle}
            placeholder="Dirección"
            value={newPedido.direccion}
            onChange={(e) => setNewPedido({ ...newPedido, direccion: e.target.value })}
          />

          <textarea
            style={{ ...inputStyle, height: 60 }}
            placeholder="Descripción (opcional)"
            value={newPedido.descripcion}
            onChange={(e) => setNewPedido({ ...newPedido, descripcion: e.target.value })}
          />

          <button style={buttonStyle} onClick={handleCreate}>
            Crear Pedido
          </button>
        </div>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thTdStyle}>ID</th>
              <th style={thTdStyle}>Cliente</th>
              <th style={thTdStyle}>Productos</th>
              <th style={thTdStyle}>Dirección</th>
              <th style={thTdStyle}>Estado</th>
              <th style={thTdStyle}>Total</th>
              <th style={thTdStyle}>Entrega</th>
              <th style={thTdStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id}>
                <td style={thTdStyle}>{p.id}</td>
                <td style={thTdStyle}>{p.cliente_nombre}</td>
                <td style={thTdStyle}>{p.detalles.map((d) => d.producto?.nombre).join(", ")}</td>
                <td style={thTdStyle}>{p.direccion}</td>
                <td style={thTdStyle}>{p.entrega ? p.entrega.estado : "PENDIENTE"}</td>
                <td style={thTdStyle}>${p.total}</td>
                <td style={thTdStyle}>
                  {p.entrega ? `Repartidor ${p.entrega.repartidor || "-"}` : "No asignada"}
                </td>
                <td style={thTdStyle}>
                  <button
                    style={{ ...buttonStyle, backgroundColor: "#e74c3c" }}
                    onClick={() => handleDelete(p.id)}
                  >
                    Eliminar
                  </button>
                  {!p.entrega && (
                    <button
                      style={{ ...buttonStyle, backgroundColor: "#2ecc71", marginLeft: 5 }}
                      onClick={() => handleAsignarEntrega(p.id)}
                    >
                      Asignar entrega
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
