const express = require('express');
const router = express.Router();
const { registroUsuario, loginUsuario, obtenerUsuarios } = require('../controllers/usuariosController');
const { verificarToken, verificarAdmin } = require('../middleware/auth'); // Middleware para proteger las rutas

// Rutas de Usuarios
router.post('/registro', registroUsuario); // Registrar usuario
router.post('/login', loginUsuario); // Iniciar sesión

// Rutas protegidas
router.get('/', verificarToken, verificarAdmin, obtenerUsuarios); // Obtener todos los usuarios (Solo para administradores)


module.exports = router;
