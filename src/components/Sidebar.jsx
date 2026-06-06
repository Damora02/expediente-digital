import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const { usuario } = useAuth();
  const esAdmin = usuario?.rol === 'admin';
  const [open, setOpen] = useState(false);

  const itemClase = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'text-white shadow-sm'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <>
      {/* Botón hamburguesa — fijo arriba izquierda */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        className="fixed top-3 left-3 z-50 w-9 h-9 rounded-lg text-white flex items-center justify-center text-lg shadow-md border-none transition-colors"
        style={{ background: '#FF33CC' }}
      >
        {open ? '✕' : '☰'}
      </button>

      {/* Overlay — cierra el panel al tocar fuera */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel lateral flotante */}
      <div
        className={`fixed top-0 left-0 h-full z-40 w-56 bg-white shadow-xl border-r border-gray-200 flex flex-col py-6 px-3 transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Espacio para no tapar el botón hamburguesa */}
        <div className="mb-4 mt-8" />

        <nav className="flex flex-col gap-1 flex-1">
          <NavLink
            to="/dashboard"
            className={itemClase}
            onClick={() => setOpen(false)}
            style={({ isActive }) => isActive ? { background: '#FF33CC' } : {}}
          >
            <span className="text-lg">🏠</span>
            Dashboard
          </NavLink>

          {esAdmin && (
            <NavLink
              to="/empleados"
              className={itemClase}
              onClick={() => setOpen(false)}
              style={({ isActive }) => isActive ? { background: '#FF33CC' } : {}}
            >
              <span className="text-lg">👥</span>
              Empleados
            </NavLink>
          )}

          {!esAdmin && (
            <NavLink
              to="/mis-expedientes"
              className={itemClase}
              onClick={() => setOpen(false)}
              style={({ isActive }) => isActive ? { background: '#FF33CC' } : {}}
            >
              <span className="text-lg">📁</span>
              Expedientes
            </NavLink>
          )}
        </nav>

        {/* Info del usuario */}
        <div className="mt-auto px-4 py-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 font-medium">Sesion activa</p>
          <p className="text-sm text-gray-700 font-semibold mt-0.5">
            {usuario?.usuario}
          </p>
          <p className="text-xs mt-0.5 capitalize" style={{ color: '#FF33CC' }}>
            {usuario?.rol}
          </p>
        </div>
      </div>
    </>
  );
}

export default Sidebar;