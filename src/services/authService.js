import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

export const login = async (usuario, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      usuario,
      password,
    });

    // response.data tiene: { token, usuario: { id, usuario, correo, rol } }
    const { token, usuario: datosUsuario } = response.data;

    // Combinamos los datos del usuario con su token en un solo objeto
    return {
      ...datosUsuario,
      token,
    };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('Usuario o contraseña incorrectos');
    }
    if (error.response && error.response.status === 429) {
      throw new Error('Demasiados intentos. Intenta de nuevo en unos minutos.');
    }
    console.error('Error al autenticar:', error);
    throw new Error('No se pudo conectar con el servidor');
  }
};