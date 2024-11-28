const express = require('express');
const cors = require('cors'); //permite conexion entre frontend y backend
const bodyParser = require('body-parser'); //Parsea Datos enviados
const proyectosRoutes = require('./routes/proyectos');
const archivosRoutes = require('./routes/archivos');

const app = express();

//MiddleWare
app.use(cors()); //CORS
app.use(bodyParser.json()); //Esta madre analiza las solicitudes JSON
app.use(bodyParser.urlencoded({ extended: true })); //Esta madre analiza las solicitudes URLencoded

//Las Pinches Rutas
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/archivos', archivosRoutes);

//Ruta Base
app.get('/', (req, res) => {
    res.send('Bienvenido a la API mas vergs');
});

//Log de errores 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Algo Salio mal con el $ervidor' });
});

//Almacenamiento de Archivos
app.use('/uploads', express.static('uploads')); //Ruta para subir archivos



const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
