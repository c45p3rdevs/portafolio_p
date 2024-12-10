const express = require('express');
const router = express.Router();
const { registroUsuario, loginUsuario, obtenerUsuarios } = require('../controllers/usuariosController');

// Rutas
router.post('/registro', registroUsuario); // Registrar usuario
router.post('/login', loginUsuario); // Iniciar sesión
router.get('/', obtenerUsuarios); // Obtener todos los usuarios (Solo para administradores)

module.exports = router;
