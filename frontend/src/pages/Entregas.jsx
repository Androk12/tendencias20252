import { useEffect, useState } from "react";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";

export default function Entregas() {
  const [entregas, setEntregas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newEntregaPedido, setNewEntregaPedido] = useState("");
  const [newEntregaRepartidor, setNewEntregaRepartidor] = useState("");
  const token = localStorage.getItem("access");

  const fetchData = async () => {
    try {
      const [entRes, pedRes, userRes] = await Promise.all([
        axios.get("entregas/", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("pedidos/", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("usuarios/", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setEntregas(entRes.data);
      setPedidos(pedRes.data);
      setUsuarios(userRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Error cargando datos");
    }
  };

  useEffect(() => { fetchData(); }, []);

  const mapEstadoPedido = (estadoEntrega) => {
    switch (estadoEntrega) {
      case "ASIGNADO":
      case "EN_CAMINO":
        return "EN_PROCESO";
      case "ENTREGADO":
        return "ENTREGADO";
      case "FALLIDO":
        return "PENDIENTE";
      default:
        return "PENDIENTE";
    }
  };

  const handleCreateEntrega = async () => {
    if (!newEntregaPedido) return alert("Selecciona un pedido");

    try {
      await axios.post(
        "entregas/",
        { pedido: parseInt(newEntregaPedido), repartidor: newEntregaRepartidor ? parseInt(newEntregaRepartidor) : null, estado: "ASIGNADO" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await axios.patch(
        `pedidos/${newEntregaPedido}/`,
        { estado: mapEstadoPedido("ASIGNADO") },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewEntregaPedido("");
      setNewEntregaRepartidor("");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error al crear entrega");
    }
  };

  const handleUpdate = async (id, field, value, pedidoId = null) => {
    try {
      const payload = { [field]: field === "repartidor" ? parseInt(value) : value };
      await axios.patch(`entregas/${id}/`, payload, { headers: { Authorization: `Bearer ${token}` } });

      if (field === "estado" && pedidoId) {
        await axios.patch(`pedidos/${pedidoId}/`, { estado: mapEstadoPedido(value) }, { headers: { Authorization: `Bearer ${token}` } });
      }

      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar entrega/pedido");
    }
  };

  const handleDeleteEntrega = async (id) => {
    try {
      await axios.delete(`entregas/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar entrega");
    }
  };

  const pedidosSinEntrega = pedidos.filter(p => !entregas.some(e => e.pedido === p.id));

  if (loading) return <p style={{ textAlign: "center", marginTop: 50, color: "#fff" }}>Cargando...</p>;

  // Estilos tipo glass
  const inputStyle = {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.4)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    outline: "none",
    minWidth: 120,
  };

  const selectStyle = {
    ...inputStyle,
    minWidth: 160,
  };

  const buttonStyle = {
    padding: "8px 16px",
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
    marginBottom: 20,
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
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
    padding: "10px 8px",
    borderBottom: "1px solid rgba(255,255,255,0.3)",
    textAlign: "left",
  };

  const CustomStyles = () => (
    <style>
      {`
        select, input::placeholder {
          color: #fff !important;
        }
        label {
          color: #fff;
        }
      `}
    </style>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif", backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/046/921/846/non_2x/cute-deliveryman-carrying-package-cartoon-illustration-vector.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", position: "relative" }}>
      <CustomStyles />
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", zIndex: 0 }} />

      {/* Sidebar */}
      <div style={{ position: "relative", zIndex: 1, width: 200 }}>
        <Sidebar textColor="#fff" />
      </div>

      {/* Contenido principal */}
      <div style={{ flex: 1, padding: 30, position: "relative", zIndex: 1, color: "#fff" }}>
        <h1 style={{ marginBottom: 30, fontSize: 28 }}>Gestión de Entregas</h1>

        {/* Crear nueva entrega */}
        <div style={cardStyle}>
          <select value={newEntregaPedido} onChange={(e) => setNewEntregaPedido(e.target.value)} style={selectStyle}>
            <option value="">Selecciona un pedido</option>
            {pedidosSinEntrega.map(p => (<option key={p.id} value={p.id}>{`Pedido ${p.id} - ${p.cliente}`}</option>))}
          </select>

          <select value={newEntregaRepartidor} onChange={(e) => setNewEntregaRepartidor(e.target.value)} style={selectStyle}>
            <option value="">Selecciona repartidor</option>
            {usuarios.filter(u => u.role === "REPARTIDOR").map(u => (<option key={u.id} value={u.id}>{u.username}</option>))}
          </select>

          <button style={buttonStyle} onClick={handleCreateEntrega}>Crear Entrega</button>
        </div>

        {/* Tabla de entregas */}
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTdStyle}>ID</th>
                <th style={thTdStyle}>Pedido</th>
                <th style={thTdStyle}>Repartidor</th>
                <th style={thTdStyle}>Estado</th>
                <th style={thTdStyle}>Observaciones</th>
                <th style={thTdStyle}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {entregas.map(e => (
                <tr key={e.id}>
                  <td style={thTdStyle}>{e.id}</td>
                  <td style={thTdStyle}>{`Pedido ${e.pedido}`}</td>
                  <td style={thTdStyle}>
                    <select
                      value={e.repartidor || ""}
                      onChange={(ev) => handleUpdate(e.id, "repartidor", ev.target.value)}
                      style={selectStyle}
                    >
                      <option value="">Selecciona repartidor</option>
                      {usuarios.filter(u => u.role === "REPARTIDOR").map(u => (<option key={u.id} value={u.id}>{u.username}</option>))}
                    </select>
                  </td>
                  <td style={thTdStyle}>
                    <select
                      value={e.estado}
                      onChange={(ev) => handleUpdate(e.id, "estado", ev.target.value, e.pedido)}
                      style={selectStyle}
                    >
                      <option value="ASIGNADO">Asignado</option>
                      <option value="EN_CAMINO">En Camino</option>
                      <option value="ENTREGADO">Entregado</option>
                      <option value="FALLIDO">Fallido</option>
                    </select>
                  </td>
                  <td style={thTdStyle}>
                    <input
                      type="text"
                      value={e.observaciones || ""}
                      onChange={(ev) => handleUpdate(e.id, "observaciones", ev.target.value)}
                      style={inputStyle}
                    />
                  </td>
                  <td style={thTdStyle}>
                    <button style={{ ...buttonStyle, backgroundColor: "#e74c3c" }} onClick={() => handleDeleteEntrega(e.id)}>Eliminar</button>
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
