import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children, soloAdmin = false }) {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  if (soloAdmin && usuario.rol !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PrivateRoute;