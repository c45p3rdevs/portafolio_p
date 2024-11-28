import api from './api';

//Subir un archivo
export const uploadArchivo = async (data) => {
    const response = await api.post('/archivos', data);
    return response.data;
};