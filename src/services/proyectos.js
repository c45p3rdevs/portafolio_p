import axios from 'axios';

const API_URL = 'http://localhost:3000/api/proyectos';

// Obtener todos los proyectos
export const getProyectos = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('authData')).token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los proyectos:', error);
    throw error;
  }
};

// Crear un nuevo proyecto
export const createProyecto = async (proyecto) => {
  try {
    const response = await axios.post(API_URL, proyecto, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('authData')).token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear el proyecto:', error);
    throw error;
  }
};

// Actualizar un proyecto existente
export const updateProyecto = async (id, proyecto) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, proyecto, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('authData')).token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el proyecto:', error);
    throw error;
  }
};

// Eliminar un proyecto
export const deleteProyecto = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('authData')).token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el proyecto:', error);
    throw error;
  }
};
