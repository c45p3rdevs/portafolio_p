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
            const { 
                nombre, 
                descripcion, 
                fecha_estimada, 
                fecha_real, 
                cumplimiento, 
                evidencia, 
                observaciones 
            } = req.body;
    
            // Validar que los campos requeridos estén presentes
            if (!nombre || !descripcion || !fecha_estimada || cumplimiento === undefined) {
                return res.status(400).json({ message: 'Faltan campos requeridos' });
            }
    
            const nuevoProyecto = await Proyecto.create({
                nombre,
                descripcion,
                fecha_estimada,
                fecha_real,
                cumplimiento,
                evidencia,
                observaciones,
            });
    
            res.status(201).json({
                message: 'Proyecto creado con éxito',
                proyecto: nuevoProyecto,
            });
        } catch (error) {
            console.error('Error al crear el proyecto:', error.message);
            res.status(500).json({ message: 'Error al crear el proyecto', error: error.message });
        }
    });

    const { body,validationResult } = require('express-validator');
    router.post(
        '/',
        [
            body('nombre').notEmpty().withMessage('El nombre es requerido'),
            body('fecha_estimada').notEmpty().withMessage('La fecha debe ser valida'),
        ],
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
        }
    );

module.exports = router;