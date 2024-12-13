import axios from 'axios';

const API_URL = 'http://localhost:3000/api/proyectos';

// Headers de autenticación
const getAuthHeader = () => {
  const authData = JSON.parse(localStorage.getItem('authData'));
  if (authData?.token) {
    return { Authorization: `Bearer ${authData.token}` };
  }
  throw new Error('Usuario no autenticado.');
};

// Obtener proyectos
export const getProyectos = async () => {
  try {
    const response = await axios.get(API_URL, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los proyectos:', error);
    throw error;
  }
};

// Crear proyecto
export const createProyecto = async (proyecto) => {
  try {
    const response = await axios.post(API_URL, proyecto, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error al crear el proyecto:', error);
    throw error;
  }
};

// Actualizar proyecto
export const updateProyecto = async (id, proyecto) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, proyecto, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el proyecto:', error);
    throw error;
  }
};

// Eliminar proyecto
export const deleteProyecto = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el proyecto:', error);
    throw error;
  }
};
