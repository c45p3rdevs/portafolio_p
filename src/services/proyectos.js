import api from './api.js';

//obtener todos los proyectos

export const getProyectos = async () => {
    const response = await api.get('/proyectos');
    return response.data;
};

//Crear nuevo proyecto
export const createProyecto = async (data) => {
    const response = await api.post('/proyectos', data);
    return response.data;

};

//Actualizar algun Proyecto
export const updateProyecto = async (id, data) => {
    const response = await api.put(`/proyectos/${id}`, data);
    return response.data;
};

//Eliminar un proyecto
export const deleteProyecto = async (id) => {
    const response = await api.delete(`/proyectos/${id}`);
    return response.data;
};