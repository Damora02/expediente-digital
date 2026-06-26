import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

// Agrega el token automaticamente, igual que en empleadoService
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

const obtenerToken = () => {
  const usuarioGuardado = localStorage.getItem('usuario_sesion');
  if (!usuarioGuardado) return null;
  return JSON.parse(usuarioGuardado).token;
};

// Sube un archivo PDF real al backend (multer + carpeta uploads)
export const subirArchivo = async (empleadoId, tipo, archivo) => {
  try {
    const formData = new FormData();
    formData.append('tipo', tipo);
    formData.append('archivo', archivo);

    const response = await axios.post(
      `${BASE_URL}/documentos/${empleadoId}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return { exito: true, nombre: archivo.name, ...response.data };
  } catch (error) {
    console.error('Error al subir archivo:', error);
    throw new Error('No se pudo guardar el archivo');
  }
};

// Lista todos los documentos de un empleado (para saber cuales ya tiene)
export const listarDocumentos = async (empleadoId) => {
  try {
    const response = await axios.get(`${BASE_URL}/documentos/${empleadoId}`);
    return response.data;
  } catch (error) {
    console.error('Error al listar documentos:', error);
    return [];
  }
};

// Devuelve la URL para ver/incrustar el PDF (ej. en un <iframe> o VisorPDF)
// El token va como query param porque los <iframe>/<embed> no pueden mandar headers
export const obtenerUrlArchivo = (empleadoId, tipo) => {
  const token = obtenerToken();
  return `${BASE_URL}/documentos/${empleadoId}/${tipo}/ver?token=${token}`;
};

// Elimina un documento especifico (archivo fisico + registro en MySQL)
export const eliminarArchivo = async (empleadoId, tipo) => {
  try {
    await axios.delete(`${BASE_URL}/documentos/${empleadoId}/${tipo}`);
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    throw new Error('No se pudo eliminar el archivo');
  }
};

// Descarga el archivo directamente (abre en pestaña nueva / fuerza descarga)
export const descargarArchivo = async (empleadoId, tipo, nombreArchivo) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/documentos/${empleadoId}/${tipo}/ver`,
      { responseType: 'blob' }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombreArchivo || `${tipo}.pdf`;
    enlace.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error al descargar archivo:', error);
    alert('No hay archivo disponible para descargar');
  }
};