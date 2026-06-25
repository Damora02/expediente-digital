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

// Convierte de camelCase (frontend) a snake_case (backend)
const aBackend = (datos) => ({
  nombre: datos.nombre,
  apellido: datos.apellido,
  tipo_identificacion: datos.tipoIdentificacion,
  numero_identificacion: datos.numeroIdentificacion,
  telefono: datos.telefono,
  correo: datos.correo,
  puesto: datos.puesto,
  fecha_ingreso: datos.fechaIngreso,
  lugar_trabajo: datos.lugarTrabajo,
  nacionalidad: datos.nacionalidad,
  genero: datos.genero,
  fecha_nacimiento: datos.fechaNacimiento || null,
  estado_civil: datos.estadoCivil,
  iban: datos.iban || null,
});

// Convierte de snake_case (backend) a camelCase (frontend)
const aFrontend = (datos) => ({
  id: datos.id,
  nombre: datos.nombre,
  apellido: datos.apellido,
  tipoIdentificacion: datos.tipo_identificacion,
  numeroIdentificacion: datos.numero_identificacion,
  telefono: datos.telefono,
  correo: datos.correo,
  puesto: datos.puesto,
  fechaIngreso: datos.fecha_ingreso ? datos.fecha_ingreso.split('T')[0] : '',
  lugarTrabajo: datos.lugar_trabajo,
  nacionalidad: datos.nacionalidad,
  genero: datos.genero,
  fechaNacimiento: datos.fecha_nacimiento ? datos.fecha_nacimiento.split('T')[0] : '',
  estadoCivil: datos.estado_civil,
  iban: datos.iban,
});

export const getEmpleados = async () => {
  const response = await axios.get(`${BASE_URL}/empleados`);
  return response.data.map(aFrontend);
};

export const getEmpleadoPorId = async (id) => {
  const response = await axios.get(`${BASE_URL}/empleados/${id}`);
  return aFrontend(response.data);
};

export const crearEmpleado = async (datos) => {
  const response = await axios.post(`${BASE_URL}/empleados`, aBackend(datos));
  return response.data;
};

export const editarEmpleado = async (id, datos) => {
  const response = await axios.put(`${BASE_URL}/empleados/${id}`, aBackend(datos));
  return response.data;
};

export const eliminarEmpleado = async (id) => {
  const response = await axios.delete(`${BASE_URL}/empleados/${id}`);
  return response.data;
};