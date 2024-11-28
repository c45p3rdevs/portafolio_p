const express  = require('express');
const router = express.Router();
const Proyecto = require('../models/Proyecto');

//Se obtienen todos los proyectos
router.get('/', async (req, res) => {
    try {
        const proyectos = await Proyecto.findAll();
        res.status(200).json(proyectos) //repuesta con status 200 exitosa
        } catch (error) {
            console.error('Error al obtener los proyectos', error); //log para depurar
            res.status(500).json({message: 'Error al obtener los proyectos', error: error.message}); //respuesta
        } 
});

    //crear un proyecto nuevo

router.post('/', async (req, res) => {
    try {
        const { nombre, descripcion, fechaEntrega, cumplimiento } = req.body;

        //Se valido que los campos requeridos esten presentes 
        if (!nombre || !descripcion || !fechaEntrega || !cumplimiento === undefined) {
            return res.status(400).json({message: 'Faltan campos requeridos'});
        }

        const nuevoProyecto = await Proyecto.create({
            nombre,
            descripcion,
            fechaEntrega,
            cumplimiento,
        });

        res.status(201).json({
            message: 'Proyecto creado con exito',
            proyecto: nuevoProyecto,
        });
        } catch (error) {
            console.error('Error al crear el proyecto', error.message); //log para depurar
            res.status(500).json({message: 'Error al crear el proyecto', error: error.message});
        }    
});

module.exports = router;