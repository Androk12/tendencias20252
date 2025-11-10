import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Sidebar = ({ textColor = "white" }) => (
  <aside className="w-64 bg-gray-800 h-screen flex flex-col justify-between p-4">
    {/* Sección superior con los enlaces */}
    <nav>
      <ul className="space-y-4">
        <li>
          <Link to="/" style={{ color: textColor }} className="hover:opacity-80">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/Productos" style={{ color: textColor }} className="hover:opacity-80">
            Inventario
          </Link>
        </li>
        <li>
          <Link to="/Pedidos" style={{ color: textColor }} className="hover:opacity-80">
            Pedidos
          </Link>
        </li>
        <li>
          <Link to="/Entregas" style={{ color: textColor }} className="hover:opacity-80">
            Entregas
          </Link>
        </li>
      </ul>
    </nav>

    {/* Sección inferior: botón de logout */}
    <div className="mt-auto">
      <LogoutButton />
    </div>
  </aside>
);

export default Sidebar;
