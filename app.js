const express = require('express');
const cors = require('cors'); // Permite conexión entre frontend y backend
const bodyParser = require('body-parser'); // Parsear datos enviados
const proyectosRoutes = require('./routes/proyectos');
const archivosRoutes = require('./routes/archivos');
const usuariosRoutes = require('./routes/usuarios'); // Importar rutas de usuarios

const app = express();

// MiddleWare
app.use(cors({
    origin: 'http://localhost:3001', // Permitir solicitudes desde el frontend en puerto 3001
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    credentials: true // Permitir envío de cookies o credenciales si se necesita
}));
app.use(bodyParser.json()); // Analiza las solicitudes JSON
app.use(bodyParser.urlencoded({ extended: true })); // Analiza las solicitudes URLencoded

// Rutas
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/archivos', archivosRoutes);
app.use('/api/usuarios', usuariosRoutes); // Agregar rutas de usuarios

// Ruta Base
app.get('/', (req, res) => {
    res.send('Bienvenido a la API Proyectos');
});

// Log de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Algo Salió mal con el servidor' });
});

// Almacenamiento de Archivos
app.use('/uploads', express.static('uploads')); // Ruta para subir archivos

// Servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
