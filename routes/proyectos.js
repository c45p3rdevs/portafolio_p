const express = require('express');
const router = express.Router();
const Proyecto = require('../models/Proyecto');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Obtener todos los proyectos (Solo administradores)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const proyectos = await Proyecto.findAll();
        res.status(200).json(proyectos);
    } catch (error) {
        console.error('Error al obtener los proyectos', error);
        res.status(500).json({ message: 'Error al obtener los proyectos', error: error.message });
    }
});

// Obtener proyectos de un usuario específico
router.get('/mis-proyectos', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; // ID del usuario autenticado
        const proyectos = await Proyecto.findAll({ where: { usuarioId: userId } });
        res.status(200).json(proyectos);
    } catch (error) {
        console.error('Error al obtener proyectos del usuario', error);
        res.status(500).json({ message: 'Error al obtener proyectos del usuario', error: error.message });
    }
});

// Crear un proyecto nuevo
router.post(
    '/',
    verifyToken, // Requiere autenticación
    [
        body('nombre').notEmpty().withMessage('El nombre es requerido'),
        body('descripcion').notEmpty().withMessage('La descripción es requerida'),
        body('fecha_estimada').notEmpty().withMessage('La fecha estimada es requerida'),
        body('cumplimiento').isInt({ min: 0, max: 100 }).withMessage('El cumplimiento debe ser un porcentaje válido (0-100)'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const {
                nombre,
                descripcion,
                fecha_estimada,
                fecha_real,
                cumplimiento,
                evidencia,
                observaciones,
            } = req.body;

            const nuevoProyecto = await Proyecto.create({
                nombre,
                descripcion,
                fecha_estimada,
                fecha_real,
                cumplimiento,
                evidencia,
                observaciones,
                usuarioId: req.user.id, // Relacionar el proyecto con el usuario autenticado
            });

            res.status(201).json({
                message: 'Proyecto creado con éxito',
                proyecto: nuevoProyecto,
            });
        } catch (error) {
            console.error('Error al crear el proyecto:', error.message);
            res.status(500).json({ message: 'Error al crear el proyecto', error: error.message });
        }
    }
);

// Actualizar un proyecto existente
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nombre,
            descripcion,
            fecha_estimada,
            fecha_real,
            cumplimiento,
            evidencia,
            observaciones,
        } = req.body;

        const proyecto = await Proyecto.findByPk(id);

        if (!proyecto) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        // Verificar si el usuario es propietario del proyecto o administrador
        if (proyecto.usuarioId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'No tienes permiso para editar este proyecto' });
        }

        // Actualizar el proyecto
        await proyecto.update({
            nombre,
            descripcion,
            fecha_estimada,
            fecha_real,
            cumplimiento,
            evidencia,
            observaciones,
        });

        res.status(200).json({ message: 'Proyecto actualizado con éxito', proyecto });
    } catch (error) {
        console.error('Error al actualizar el proyecto:', error.message);
        res.status(500).json({ message: 'Error al actualizar el proyecto', error: error.message });
    }
});

// Eliminar un proyecto
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        const proyecto = await Proyecto.findByPk(id);

        if (!proyecto) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        // Verificar si el usuario es propietario del proyecto o administrador
        if (proyecto.usuarioId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'No tienes permiso para eliminar este proyecto' });
        }

        await proyecto.destroy();

        res.status(200).json({ message: 'Proyecto eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar el proyecto:', error);
        res.status(500).json({ message: 'Error al eliminar el proyecto', error: error.message });
    }
});

module.exports = router;

