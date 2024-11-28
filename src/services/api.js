import axios from 'axios';

// configuracion de la base URL para las pinches peticiones

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

export default api;