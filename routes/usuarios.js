const express = require('express');
const router = express.Router();
const { registroUsuario, loginUsuario, obtenerUsuarios } = require('../controllers/usuariosController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Comprueba si los controladores están definidos
console.log({ registroUsuario, loginUsuario, obtenerUsuarios });
if (!registroUsuario || !loginUsuario || !obtenerUsuarios) {
  throw new Error('Uno o más controladores no están definidos.');
}

// Rutas de Usuarios
router.post('/registro', registroUsuario);
router.post('/login', loginUsuario);
router.get('/', verifyToken, verifyAdmin, obtenerUsuarios);

module.exports = router;


