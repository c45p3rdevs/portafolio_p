const express = require('express');
const router = express.Router();
const Archivo = require('../models/Archivo');
const multer = require('multer');
const path = require('path');


//Config de multer para la carga de archivos

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); //Carpeta de almacenamiento de Archivos
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null,  `${uniqueSuffix}-${file.originalname}`);
    },
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, //limite de tamaño de archivo 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|ppt|/;
        const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (extName) {
            return cb(null, true);
            } else {
                cb(new Error('Tipo de archivo no permitido'));
            }
        },
    });

    //Crear un nuevo archivo
    router.post('/', upload.single('archivo'), async(req, res) => {
        try{
            if (!req.file) {
                return res.status(400).json({ message: 'No se ha seleccionado ningún archivo'});
            }

            const nuevoArchivo = await Archivo.create({
                nombre: req.file.originalname,
                ruta: req.file.path,
                tipo: req.file.mimetype,
                tamamo: req.file.size,
            });
        
            res.status(201).json({
                message: 'Archivo cargado con éxito',
                archivo: nuevoArchivo,
                });
            } catch (error){
                console.error('Error al crear el archivo', error.message);
                res.status(500).json({ message: 'Error al crear el archivo', error: error.message });
            }
    });

    //Obtener todos los archivos
    router.get('/', async(req, res) => {
        try{
            const archivos = await Archivo.findAll();
            res.status(200).json(archivos);
        } catch (error) {
            console.error('Error al obtener los archivos', error.message);
            res.status(500).json({ message: 'Error al obtener los archivos', error: error.message });
        }
    });

    //Eliminar un archivo por ID
    router.delete('/:id', async(req, res) => {
        try{
            const archivo = await Archivo.findByPk(req.params.id);
            if (!archivo) {
                return res.status(404).json({ message: 'Archivo no encontrado' });
            }

            await archivo.destroy();
            res.status(200).json({ message: 'Archivo eliminado con éxito' });
            } catch (error) {
                console.error('Error al eliminar el archivo', error.message);
                res.status(500).json({ message: 'Error al eliminar el archivo', error: error.message});
            }
    });
    


module.exports = router;