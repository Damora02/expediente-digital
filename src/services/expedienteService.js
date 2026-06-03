const archivoABase64 = (archivo) => {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.readAsDataURL(archivo);
    lector.onload = () => resolve(lector.result);
    lector.onerror = (error) => reject(error);
  });
};

export const subirArchivo = async (empleadoId, tipo, archivo) => {
  try {
    const base64 = await archivoABase64(archivo);
    const clave = `pdf_${empleadoId}_${tipo}`;
    localStorage.setItem(clave, base64);
    localStorage.setItem(`${clave}_nombre`, archivo.name);
    return { exito: true, nombre: archivo.name };
  } catch (error) {
    console.error('Error al subir archivo:', error);
    throw new Error('No se pudo guardar el archivo');
  }
};

export const obtenerArchivo = (empleadoId, tipo) => {
  const clave = `pdf_${empleadoId}_${tipo}`;
  const base64 = localStorage.getItem(clave);
  const nombre = localStorage.getItem(`${clave}_nombre`);
  if (!base64) return null;
  return { base64, nombre };
};

export const eliminarArchivo = (empleadoId, tipo) => {
  const clave = `pdf_${empleadoId}_${tipo}`;
  localStorage.removeItem(clave);
  localStorage.removeItem(`${clave}_nombre`);
};

export const descargarArchivo = (empleadoId, tipo, nombreArchivo) => {
  const datos = obtenerArchivo(empleadoId, tipo);
  if (!datos) {
    alert('No hay archivo disponible para descargar');
    return;
  }
  const enlace = document.createElement('a');
  enlace.href = datos.base64;
  enlace.download = nombreArchivo || datos.nombre || `${tipo}.pdf`;
  enlace.click();
};