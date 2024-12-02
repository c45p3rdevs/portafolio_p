import axios from 'axios';

// configuracion de la base URL para las pinches peticiones

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
});

export default api;