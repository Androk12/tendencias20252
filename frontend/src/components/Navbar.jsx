import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem", background: "#eee" }}>
      <Link to="/login">Login</Link>
      <Link to="/productos">Productos</Link>
      <Link to="/pedidos">Pedidos</Link>
      <Link to="/perfil">Perfil</Link>
    </nav>
  );
}
