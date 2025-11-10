// src/pages/DashboardRepartidor.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import NavbarRepartidor from "../components/NavbarRepartidor";

export default function DashboardRepartidor() {
  const [pedidos, setPedidos] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const repartidorId = parseInt(localStorage.getItem("usuarioId"), 10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pedidosRes, detallesRes, productosRes, entregasRes] = await Promise.all([
          axios.get("/pedidos/"),
          axios.get("/detalles-pedido/"),
          axios.get("/productos/"),
          axios.get("/entregas/"),
        ]);

        const pedidosConEntregas = pedidosRes.data.map((pedido) => {
          const entrega = entregasRes.data.find(e => e.pedido === pedido.id);
          return { ...pedido, entrega };
        });

        const pendientes = pedidosConEntregas.filter(
          (pedido) => !pedido.entrega || pedido.entrega.estado !== "ENTREGADO"
        );

        setPedidos(pendientes);
        setDetalles(detallesRes.data);
        setProductos(productosRes.data);
      } catch (err) {
        console.error("Error al cargar pedidos:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDetallesByPedido = (pedidoId) =>
    detalles.filter((d) => d.pedido === pedidoId);

  const getNombreProducto = (productoId) => {
    const prod = productos.find((p) => p.id === productoId);
    return prod ? prod.nombre : `Producto #${productoId}`;
  };

  const tieneEntregaActiva = () => {
    return pedidos.some(
      (p) =>
        p.entrega &&
        p.entrega.repartidor === repartidorId &&
        p.entrega.estado !== "ENTREGADO" &&
        p.entrega.estado !== "FALLIDO"
    );
  };

  const handleAsignar = async (pedido) => {
    try {
      if (tieneEntregaActiva()) {
        alert("Debes completar tu entrega actual antes de asignarte a otra.");
        return;
      }

      let entregaId;

      if (pedido.entrega) {
        entregaId = pedido.entrega.id;
        await axios.patch(`/entregas/${entregaId}/`, {
          repartidor: repartidorId,
          estado: "EN_CAMINO",
        });
      } else {
        const res = await axios.post("/entregas/", {
          pedido: parseInt(pedido.id, 10),
          repartidor: repartidorId,
          estado: "ASIGNADO",
        });
        entregaId = res.data.id;
      }

      setPedidos((prev) =>
        prev.map((p) =>
          p.id === pedido.id
            ? {
                ...p,
                entrega: {
                  ...p.entrega,
                  repartidor: repartidorId,
                  estado: "EN_CAMINO",
                  id: entregaId,
                },
              }
            : p
        )
      );
    } catch (err) {
      console.error("Error al asignarse:", err.response?.data || err);
      alert("No se pudo asignar el pedido.");
    }
  };

  const handleCambiarEstado = async (pedido, nuevoEstado) => {
    try {
      if (!pedido.entrega) return;

      const estadoFinal = nuevoEstado.toUpperCase();

      await axios.patch(`/entregas/${pedido.entrega.id}/`, {
        estado: estadoFinal,
      });

      setPedidos((prev) =>
        prev.map((p) =>
          p.id === pedido.id
            ? { ...p, entrega: { ...p.entrega, estado: estadoFinal } }
            : p
        )
      );

      await axios.patch(`/pedidos/${pedido.id}/`, {
        estado: estadoFinal === "ENTREGADO" ? "ENTREGADO" : "PENDIENTE",
      });
    } catch (err) {
      console.error("Error al actualizar estado:", err.response?.data || err);
      alert("No se pudo actualizar el estado del pedido.");
    }
  };

  if (loading) return <p>Cargando pedidos pendientes...</p>;

  return (
    <div style={{ padding: "20px", backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      <NavbarRepartidor />
      <h2 style={{ textAlign: "center", margin: "20px 0", color: "#333" }}>Pedidos Pendientes</h2>
      {pedidos.length === 0 ? (
        <p style={{ textAlign: "center" }}>No hay pedidos pendientes por el momento.</p>
      ) : (
        pedidos.map((pedido) => {
          const detallesPedido = getDetallesByPedido(pedido.id);
          const entrega = pedido.entrega;

          return (
            <div key={pedido.id} style={styles.pedidoCard}>
              <div style={styles.pedidoHeader}>
                <h3>Pedido #{pedido.id}</h3>
                {entrega ? (
                  <span style={{ ...styles.estadoBadge, ...estadoColor(entrega.estado) }}>
                    {entrega.estado}
                  </span>
                ) : (
                  <span style={{ ...styles.estadoBadge, ...estadoColor("SIN ASIGNAR") }}>
                    SIN ASIGNAR
                  </span>
                )}
              </div>
              <p><strong>Dirección:</strong> {pedido.direccion}</p>
              <p><strong>Descripción:</strong> {pedido.descripcion || "Sin descripción"}</p>
              <p><strong>Total:</strong> ${pedido.total}</p>

              <h4>Productos:</h4>
              <ul>
                {detallesPedido.map((item) => (
                  <li key={item.id}>
                    {getNombreProducto(item.producto)} x {item.cantidad}
                  </li>
                ))}
              </ul>

              {entrega ? (
                <div style={{ marginTop: "10px" }}>
                  <p>Repartidor: {entrega.repartidor === repartidorId ? "Tú" : entrega.repartidor || "Sin asignar"}</p>

                  {entrega.repartidor === repartidorId && (
                    <select
                      value={entrega.estado}
                      onChange={(e) => handleCambiarEstado(pedido, e.target.value)}
                      style={styles.selectEstado}
                    >
                      <option value="ASIGNADO">Asignado</option>
                      <option value="EN_CAMINO">En Camino</option>
                      <option value="ENTREGADO">Entregado</option>
                      <option value="FALLIDO">Fallido</option>
                    </select>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleAsignar(pedido)}
                  style={styles.asignarBtn}
                >
                  Asignarme a este pedido
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

const estadoColor = (estado) => {
  switch (estado) {
    case "ASIGNADO":
      return { backgroundColor: "#ffd966", color: "#333" };
    case "EN_CAMINO":
      return { backgroundColor: "#4da6ff", color: "white" };
    case "ENTREGADO":
      return { backgroundColor: "#28a745", color: "white" };
    case "FALLIDO":
      return { backgroundColor: "#dc3545", color: "white" };
    default:
      return { backgroundColor: "#999", color: "white" };
  }
};

const styles = {
  pedidoCard: {
    borderRadius: "8px",
    backgroundColor: "white",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0px 3px 8px rgba(0,0,0,0.1)",
  },
  pedidoHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  estadoBadge: {
    padding: "5px 10px",
    borderRadius: "5px",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: "0.85rem",
  },
  selectEstado: {
    padding: "5px 10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    cursor: "pointer",
  },
  asignarBtn: {
    padding: "8px 12px",
    backgroundColor: "#ff4d4d",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
};
