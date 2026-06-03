import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('usuario_sesion');
    return guardado ? JSON.parse(guardado) : null;
  });

  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (usuario) {
      localStorage.setItem('usuario_sesion', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('usuario_sesion');
    }
  }, [usuario]);

  const login = (datosUsuario) => {
    setUsuario(datosUsuario);
  };

  const logout = () => {
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, cargando, setCargando }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return contexto;
}

export default AuthContext;