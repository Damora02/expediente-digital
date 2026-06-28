import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const menuRef = useRef(null);

  const confirmarLogout = () => {
    logout();
    navigate('/');
  };

  // Cierra el menu si se hace click fuera de el
  useEffect(() => {
    const handleClickFuera = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMostrarMenu(false);
      }
    };

    if (mostrarMenu) {
      document.addEventListener('mousedown', handleClickFuera);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickFuera);
    };
  }, [mostrarMenu]);

  return (
    <header className="px-6 py-3 flex items-center justify-between shadow-sm"
      style={{ background: '#FF33CC', borderBottom: '1px solid #cc00a3' }}>
      <div className="flex-1"></div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: '#FF33CC', border: '2px solid rgba(255,255,255,0.5)' }}>
          <span className="font-bold text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>DP</span>
        </div>
        <span className="font-semibold text-white text-lg">
          Deco Pastel Costa Rica
        </span>
      </div>
      <div className="flex-1 flex items-center justify-end gap-4">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          usuario?.rol === 'admin'
            ? 'bg-white text-pink-600'
            : 'bg-white text-gray-600'
        }`}>
          {usuario?.rol === 'admin' ? 'Administrador' : 'Usuario'}
        </span>
        <span className="text-sm text-white">
          👤 {usuario?.usuario}
        </span>

        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setMostrarMenu(prev => !prev)}
            aria-label="Cerrar sesion"
            className="p-2 rounded-lg transition-colors duration-200 border flex items-center justify-center"
            style={{ background: 'white', color: '#FF33CC', borderColor: 'white' }}
          >
            <LogOut size={18} />
          </button>

          {mostrarMenu && (
            <>
              <div style={{
                position: 'absolute', top: '38px', right: '8px',
                width: 0, height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderBottom: '8px solid white',
              }} />

              <div style={{
                position: 'absolute', top: '46px', right: 0,
                background: 'white', borderRadius: '10px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                padding: '6px', minWidth: '150px', zIndex: 10,
              }}>
                <button
                  onClick={() => setMostrarMenu(false)}
                  className="block w-full text-left px-3 py-2 text-sm font-medium rounded-md"
                  style={{ color: '#00BFFF' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarLogout}
                  className="block w-full text-left px-3 py-2 text-sm font-medium rounded-md"
                  style={{ color: '#FF33CC' }}
                >
                  Cerrar sesion
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;