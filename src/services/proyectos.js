import api from './api';

// Obtener todos los proyectos
export const getProyectos = async () => {
    try {
        const response = await api.get('/proyectos');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los proyectos:', error);
        throw error;
    }
};

// Crear nuevo proyecto
export const createProyecto = async (data) => {
    try {
        const response = await api.post('/proyectos', data);
        return response.data;
    } catch (error) {
        console.error('Error al crear el proyecto:', error);
        throw error;
    }
};

// Actualizar algún proyecto
export const updateProyecto = async (id, data) => {
    try {
        const response = await api.put(`/proyectos/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el proyecto:', error);
        throw error;
    }
};

// Eliminar un proyecto
export const deleteProyecto = async (id) => {
    try {
        const response = await api.delete(`/proyectos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar el proyecto:', error);
        // Capturamos errores específicos
        if (error.response && error.response.status === 404) {
            console.error(`Proyecto con ID ${id} no encontrado.`);
        } else {
            console.error('Error desconocido al eliminar el proyecto:', error);
        }
        throw error;
    }
};
