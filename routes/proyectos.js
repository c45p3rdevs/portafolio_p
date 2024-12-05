const express = require('express');
const router = express.Router();
const Proyecto = require('../models/Proyecto');

// Obtener todos los proyectos
router.get('/', async (req, res) => {
    try {
        const proyectos = await Proyecto.findAll();
        res.status(200).json(proyectos);
    } catch (error) {
        console.error('Error al obtener los proyectos', error);
        res.status(500).json({ message: 'Error al obtener los proyectos', error: error.message });
    }
});

// Crear un proyecto nuevo
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

// Validación de datos
const { body, validationResult } = require('express-validator');
router.post(
    '/',
    [
        body('nombre').notEmpty().withMessage('El nombre es requerido'),
        body('fecha_estimada').notEmpty().withMessage('La fecha debe ser válida'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    }
);

// Eliminar un proyecto
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const proyecto = await Proyecto.findByPk(id);

        if (!proyecto) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        await proyecto.destroy();

        res.status(200).json({ message: 'Proyecto eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar el proyecto:', error);
        res.status(500).json({ message: 'Error al eliminar el proyecto', error: error.message });
    }
});

module.exports = router;
