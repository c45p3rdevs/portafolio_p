const express  = require('express');
const router = express.Router();
const Proyecto = require('../models/Proyecto');

//Se obtienen todos los proyectos
router.get('/', async (req, res) => {
    try {
        const proyectos = await Proyecto.findAll();
        res.json(proyectos);
        } catch (error) {
            res.status(500).json({message: 'Error al obtener los proyectos'});
        }
    }); 

    //crear un proyecto nuevo

router.post('/', async (req, res) => {
    try {
        const proyecto = await Proyecto.create(req.body);
        res.status(201).json(proyecto);
        } catch (error) {
            res.status(500).json({message: 'Error al crear el proyecto'});
        }
});

module.exports = router;