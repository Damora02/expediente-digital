import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

export const getEmpleados = async () => {
  const response = await axios.get(`${BASE_URL}/empleados`);
  return response.data;
};

export const getEmpleadoPorId = async (id) => {
  const response = await axios.get(`${BASE_URL}/empleados/${id}`);
  return response.data;
};

export const crearEmpleado = async (datos) => {
  const response = await axios.post(`${BASE_URL}/empleados`, datos);
  return response.data;
};

export const editarEmpleado = async (id, datos) => {
  const response = await axios.put(`${BASE_URL}/empleados/${id}`, datos);
  return response.data;
};

export const eliminarEmpleado = async (id) => {
  const response = await axios.delete(`${BASE_URL}/empleados/${id}`);
  return response.data;
};