import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const { usuario } = useAuth();
  const esAdmin = usuario?.rol === 'admin';

  const itemClase = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-pink-400 text-white shadow-sm'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-200 flex flex-col py-6 px-3">
      
      <nav className="flex flex-col gap-1 flex-1">
        
        <NavLink to="/dashboard" className={itemClase}>
          <span className="text-lg">🏠</span>
          Dashboard
        </NavLink>

        {esAdmin && (
          <NavLink to="/empleados" className={itemClase}>
            <span className="text-lg">👥</span>
            Empleados
          </NavLink>
        )}

        {!esAdmin && (
          <NavLink to="/mis-expedientes" className={itemClase}>
    <span className="text-lg">📁</span>
    Expedientes
          </NavLink>
        )}

      </nav>

      <div className="mt-auto px-4 py-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500 font-medium">Sesion activa</p>
        <p className="text-sm text-gray-700 font-semibold mt-0.5">
          {usuario?.usuario}
        </p>
        <p className="text-xs text-pink-600 mt-0.5 capitalize">
          {usuario?.rol}
        </p>
      </div>

    </aside>
  );
}

export default Sidebar;