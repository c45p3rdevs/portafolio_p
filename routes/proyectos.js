const express = require('express');
const router = express.Router();
const Proyecto = require('../models/Proyecto');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Obtener todos los proyectos
router.get('/', verifyToken, async (req, res) => {
  try {
    const proyectos = await Proyecto.findAll();
    res.status(200).json(proyectos);
  } catch (error) {
    console.error('Error al obtener los proyectos:', error.message);
    res.status(500).json({ message: 'Error al obtener los proyectos', error: error.message });
  }
});

// Crear un nuevo proyecto
router.post(
  '/',
  verifyToken,
  [
    body('nombre').notEmpty().withMessage('El nombre es requerido'),
    body('descripcion').notEmpty().withMessage('La descripción es requerida'),
    body('fecha_estimada').notEmpty().withMessage('La fecha estimada es requerida'),
    body('cumplimiento').isInt({ min: 0, max: 100 }).withMessage('El cumplimiento debe estar entre 0 y 100'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { nombre, descripcion, fecha_estimada, cumplimiento } = req.body;

      const nuevoProyecto = await Proyecto.create({
        nombre,
        descripcion,
        fecha_estimada,
        cumplimiento,
        usuarioId: req.user.id,
      });

      res.status(201).json({ message: 'Proyecto creado con éxito', proyecto: nuevoProyecto });
    } catch (error) {
      console.error('Error al crear el proyecto:', error.message);
      res.status(500).json({ message: 'Error al crear el proyecto', error: error.message });
    }
  }
);

// Actualizar un proyecto
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, fecha_estimada, cumplimiento } = req.body;

    const proyecto = await Proyecto.findByPk(id);
    if (!proyecto) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Verificar permisos
    if (proyecto.usuarioId !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para editar este proyecto' });
    }

    await proyecto.update({ nombre, descripcion, fecha_estimada, cumplimiento });
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

    // Verificar permisos
    if (proyecto.usuarioId !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este proyecto' });
    }

    await proyecto.destroy();
    res.status(200).json({ message: 'Proyecto eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar el proyecto:', error.message);
    res.status(500).json({ message: 'Error al eliminar el proyecto', error: error.message });
  }
});

module.exports = router;
