// src/pages/MisPedidos.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import "../components/MisPedidos.css";

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [entregas, setEntregas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const usuarioId = parseInt(localStorage.getItem("usuarioId"), 10);

  const fetchData = async () => {
    try {
      const [pedidosRes, detallesRes, entregasRes, productosRes] =
        await Promise.all([
          axios.get("/pedidos/"),
          axios.get("/detalles-pedido/"),
          axios.get("/entregas/"),
          axios.get("/productos/"),
        ]);

      const misPedidos = pedidosRes.data.filter(
        (pedido) => pedido.cliente === usuarioId
      );

      setPedidos(misPedidos);
      setDetalles(detallesRes.data);
      setEntregas(entregasRes.data);
      setProductos(productosRes.data);
    } catch (err) {
      console.error("Error al cargar pedidos:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [usuarioId]);

  const getDetallesByPedido = (pedidoId) =>
    detalles.filter((d) => d.pedido === pedidoId);

  const getEntregaByPedido = (pedidoId) =>
    entregas.find((e) => e.pedido === pedidoId);

  const getNombreProducto = (productoId) => {
    const prod = productos.find((p) => p.id === productoId);
    return prod ? prod.nombre : `Producto #${productoId}`;
  };

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

  if (loading) return <p style={{ textAlign: "center" }}>Cargando tus pedidos...</p>;

  return (
    <div style={{ padding: "20px", backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      <Navbar carritoCount={0} />
      <h2 style={{ textAlign: "center", margin: "20px 0", color: "#333" }}>Mis Pedidos</h2>

      {!loading && pedidos.length === 0 && (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <img
            src="https://img.freepik.com/fotos-premium/carrito-compras-vacio-rojo_806906-39.jpg"
            alt="Carrito vacío"
            style={{ maxWidth: "200px", marginBottom: "20px" }}
          />
          <h3>No tienes pedidos aún</h3>
          <p>
            Visita la sección de <a href="/cliente/productos">Productos</a> y realiza tu primer pedido.
          </p>
        </div>
      )}

      {!loading &&
        pedidos.map((pedido) => {
          const detallesPedido = getDetallesByPedido(pedido.id);
          const entrega = getEntregaByPedido(pedido.id);

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

              <h4>Entrega:</h4>
              {entrega ? (
                <p>
                  Repartidor: {entrega.repartidor || "Sin asignar"}
                </p>
              ) : (
                <p>Entrega aún no asignada</p>
              )}
            </div>
          );
        })}
    </div>
  );
}

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
};
