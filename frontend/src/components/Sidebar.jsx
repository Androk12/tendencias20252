import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => (
  <aside className="w-64 bg-gray-800 text-white h-screen p-4">
    <nav>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/Productos">Inventario</Link></li>
        <li><Link to="/Pedidos">Pedidos</Link></li>
        <li><Link to="/users">Usuarios</Link></li>
        <li><Link to="/reports">Reportes</Link></li>
      </ul>
    </nav>
  </aside>
);

export default Sidebar;
