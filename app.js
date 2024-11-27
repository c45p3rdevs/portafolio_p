const express = require('express');
const app = express();
const proyectosRoutes = require('./routes/proyectos');
const archivosRoutes = require('./routes/archivos');

app.use('/api/proyectos', proyectosRoutes);
app.use('/api/archivos', archivosRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
