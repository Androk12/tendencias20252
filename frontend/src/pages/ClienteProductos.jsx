import React, { useEffect, useState } from "react"; 
import Navbar from "../components/Navbar";
import axios from "../api/axios"; 
import { getProductImage } from "../utils/productImages";
import "../components/ClienteProductos.css";

export default function ClienteProducto() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [direccion, setDireccion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await axios.get("/productos/");
        setProductos(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProductos();
  }, []);

  const addToCart = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(p => p.id === producto.id);
      if (existe) {
        return prev.map(p => p.id === producto.id ? {...p, cantidad: p.cantidad + 1} : p);
      }
      return [...prev, {...producto, cantidad: 1}];
    });
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito(prev => prev.filter(p => p.id !== productoId));
  };

  const handleConfirmarPedido = async () => {
    if (!direccion) {
      alert("Debes ingresar la dirección para el pedido.");
      return;
    }
    if (carrito.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    const clienteId = localStorage.getItem("usuarioId");
    if (!clienteId) {
      alert("No se encontró el usuario logueado.");
      return;
    }

    try {
      const pedidoData = {
        direccion,
        descripcion,
        total: carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0),
        cliente: clienteId,
      };

      const resPedido = await axios.post("/pedidos/", pedidoData);
      const nuevoPedidoId = resPedido.data.id;

      for (const producto of carrito) {
        await axios.post("/api/detalles-pedido/", {
          pedido: nuevoPedidoId,
          producto: producto.id,
          cantidad: producto.cantidad
        });
      }

      alert("Pedido confirmado!");
      setCarrito([]);
      setDireccion("");
      setDescripcion("");
      setCarritoAbierto(false);

    } catch (err) {
      console.error("Error al confirmar pedido:", err.response?.data || err);
      alert("Error al confirmar el pedido. Revisa la consola para más detalles.");
    }
  };

  return (
    <div>
      <Navbar 
        carritoCount={carrito.length} 
        toggleCarrito={() => setCarritoAbierto(!carritoAbierto)} 
      />

      {/* Contenedor principal para evitar que el navbar tape los productos */}
      <div className="main-content">
        <div className="productos-grid">
          {productos.map(producto => (
            <div key={producto.id} className="producto-card">
              <img src={getProductImage(producto.nombre)} alt={producto.nombre} />
              <h3>{producto.nombre}</h3>
              <p>${producto.precio}</p>
              <button className="add-cart-btn" onClick={() => addToCart(producto)}>Añadir al carrito</button>
            </div>
          ))}
        </div>

        {/* Panel del carrito */}
        <div className={`carrito-panel ${carritoAbierto ? "open" : ""}`}>
          <h3>Mi Carrito</h3>
          <ul>
            {carrito.map(item => (
              <li key={item.id}>
                {item.nombre} x {item.cantidad} - ${item.precio * item.cantidad}
                <button className="remove-btn" onClick={() => eliminarDelCarrito(item.id)}>❌</button>
              </li>
            ))}
          </ul>

          <input 
            type="text" 
            placeholder="Dirección" 
            value={direccion} 
            onChange={(e) => setDireccion(e.target.value)} 
          />
          <textarea 
            placeholder="Descripción (opcional)" 
            value={descripcion} 
            onChange={(e) => setDescripcion(e.target.value)} 
          />

          <button className="confirm-btn" onClick={handleConfirmarPedido}>Confirmar Pedido</button>
        </div>
      </div>
    </div>
  );
}
