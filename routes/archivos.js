const express = require('express');
const app = express.Router();
const Archivo = require('./models/Archivo');


//Crear nuevo archivo

router.post('/', async (req, res) => {
    try {
        const archivo = await Archivo.create(req.body);
        res.status(201).json(archivo);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear el archivo' });
    }
});

module.exports = router;