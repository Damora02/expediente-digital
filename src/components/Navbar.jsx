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
    <header className="bg-pink-200 border-b border-pink-300 px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex-1"></div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-pink-400 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm"></span>
        </div>
        <span className="font-semibold text-pink-800 text-lg">
          Deco Pastel Costa Rica
        </span>
      </div>
      <div className="flex-1 flex items-center justify-end gap-4">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          usuario?.rol === 'admin'
            ? 'bg-pink-100 text-pink-700'
            : 'bg-gray-100 text-gray-600'
        }`}>
          {usuario?.rol === 'admin' ? 'Administrador' : 'Usuario'}
        </span>
        <span className="text-sm text-pink-700">
          👤 {usuario?.usuario}
        </span>
        <button
          onClick={handleLogout}
          className="text-sm bg-white text-pink-600 hover:bg-pink-50 px-3 py-1.5 rounded-lg transition-colors duration-200 font-medium border border-pink-300"
        >
          Cerrar sesion
        </button>
      </div>
    </header>
  );
}

export default Navbar;