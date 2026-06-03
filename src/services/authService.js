import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

export const login = async (usuario, password) => {
  try {
    const response = await axios.get(`${BASE_URL}/usuarios`);
    const usuarios = response.data;
    const encontrado = usuarios.find(
      (u) => u.usuario === usuario && u.password === password
    );
    return encontrado || null;
  } catch (error) {
    console.error('Error al autenticar:', error);
    throw new Error('No se pudo conectar con el servidor');
  }
};