import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
        <button
          onClick={handleLogout}
          className="text-sm px-3 py-1.5 rounded-lg transition-colors duration-200 font-medium border"
          style={{ background: 'white', color: '#FF33CC', borderColor: 'white' }}
          onMouseEnter={e => e.currentTarget.style.background = '#fce7f3'}
          onMouseLeave={e => e.currentTarget.style.background = 'white'}
        >
          Cerrar sesion
        </button>
      </div>
    </header>
  );
}

export default Navbar;