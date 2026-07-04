import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
function Reloj() {
  const [hora, setHora] = useState('');

  useEffect(() => {
    const actualizar = () => {
      const ahora = new Date();
      setHora(ahora.toLocaleTimeString('es-CR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }));
    };
    actualizar();
    const intervalo = setInterval(actualizar, 1000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <span className="text-sm font-mono font-bold text-gray-900">
      {hora}
    </span>
  );
}

function Sidebar() {
 const { usuario } = useAuth();
  const esAdmin = usuario?.rol === 'admin';
  const [open, setOpen] = useState(false);
  const [expedientesOpen, setExpedientesOpen] = useState(false);

 useEffect(() => {
  const cerrarConEscape = (e) => {
    if (e.key === 'Escape') setOpen(false);
  };
  document.addEventListener('keydown', cerrarConEscape);
  return () => document.removeEventListener('keydown', cerrarConEscape);
}, []);


  const itemClase = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'text-white shadow-sm'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;
    const itemEstilo = ({ isActive }) =>
  isActive
    ? { background: 'linear-gradient(135deg, #FF33CC, #E619B3)', boxShadow: '0 2px 8px rgba(255,51,204,0.35)' }
    : {};

  return (
    <>
      {/* Botón hamburguesa */}
     <button
  onClick={() => setOpen(o => !o)}
  aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
  aria-expanded={open}
  className="fixed top-3 left-3 z-50 w-9 h-9 rounded-lg flex flex-col items-center justify-center gap-1.5 shadow-md border-none"
  style={{ background: '#FF33CC' }}
>
  <span className={`block w-5 h-0.5 bg-white rounded transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
  <span className={`block w-5 h-0.5 bg-white rounded transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
  <span className={`block w-5 h-0.5 bg-white rounded transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
</button>

      {/* Overlay */}
      {open && (
  <div
    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
    onClick={() => setOpen(false)}
  />
)}

      {/* Panel lateral */}
      <div
  className={`fixed top-0 left-0 h-full z-40 w-56 shadow-xl border-r border-gray-200 flex flex-col py-6 px-3 transition-transform duration-300 ${
    open ? 'translate-x-0' : '-translate-x-full'
  }`}
  style={{ background: 'linear-gradient(180deg, #ffffff, #ffd6f0)' }}
>
        <div className="mb-4 mt-8" />

        <nav className="flex flex-col gap-1 flex-1">
          <NavLink
            to="/dashboard"
            className={itemClase}
            onClick={() => setOpen(false)}
        style={itemEstilo}
          >
            <span className="text-lg">🏠</span>
            Inicio
          </NavLink>

          {esAdmin && (
            <NavLink
              to="/empleados"
              className={itemClase}
              onClick={() => setOpen(false)}
           style={itemEstilo}
            >
              <span className="text-lg">👥</span>
              Empleados
            </NavLink>
          )}

          {esAdmin && (
            <NavLink
              to="/usuarios"
              className={itemClase}
              onClick={() => setOpen(false)}
              style={itemEstilo}
            >
              <span className="text-lg">🔐</span>
              Usuarios
            </NavLink>
          )}

          {/* Expedientes con subcarpeta para empleado */}
          {!esAdmin && (
            <div>
              <button
                onClick={() => setExpedientesOpen(o => !o)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
              >
                <span className="text-lg">📁</span>
                <span className="flex-1 text-left">Expedientes</span>
                <span className="text-xs">{expedientesOpen ? '▲' : '▼'}</span>
              </button>

              {expedientesOpen && (
                <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-pink-100 pl-3">
                  <NavLink
                    to="/mis-expedientes"
                    className={itemClase}
                    onClick={() => setOpen(false)}
                    style={itemEstilo}
                  >
                    <span className="text-lg">📂</span>
                    Mi expediente
                  </NavLink>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Info del usuario */}
        <div className="mt-auto px-4 py-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-bold text-gray-900 mb-1"><Reloj /></p>
          <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
  Sesión activa
</p>
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
