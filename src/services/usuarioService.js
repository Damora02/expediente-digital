import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

axios.interceptors.request.use((config) => {
  const usuarioGuardado = localStorage.getItem('usuario_sesion');
  if (usuarioGuardado) {
    const usuario = JSON.parse(usuarioGuardado);
    if (usuario.token) {
      config.headers.Authorization = `Bearer ${usuario.token}`;
    }
  }
  return config;
});

export const crearUsuario = async (datos) => {
  const response = await axios.post(`${BASE_URL}/auth/registro`, datos);
  return response.data;
};

export const cambiarPassword = async (passwordActual, passwordNueva) => {
  const response = await axios.put(`${BASE_URL}/auth/cambiar-password`, {
    passwordActual,
    passwordNueva,
  });
  return response.data;
};