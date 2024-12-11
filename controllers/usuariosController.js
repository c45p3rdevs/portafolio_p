const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { QueryTypes } = require('sequelize');

// Registrar un nuevo usuario
exports.registroUsuario = async (req, res) => {
    const { nombre, correo, contraseña, rol } = req.body;
  
    try {
      // Validar campos requeridos
      if (!nombre || !correo || !contraseña) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
      }
  
      // Verificar si el correo ya está registrado
      const existeUsuario = await db.query(
        'SELECT * FROM usuarios WHERE correo = ?',
        { replacements: [correo], type: QueryTypes.SELECT }
      );
  
      if (existeUsuario.length > 0) {
        return res.status(400).json({ error: 'El correo ya está registrado.' });
      }
  
      // Cifrar la contraseña
      const salt = await bcrypt.genSalt(10);
      const hashContraseña = await bcrypt.hash(contraseña, salt);
      console.log('Hash generado:', hashContraseña);
  
      // Insertar usuario
      await db.query(
        'INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES (?, ?, ?, ?)',
        { replacements: [nombre, correo, hashContraseña, rol || 'usuario'], type: QueryTypes.INSERT }
      );
  
      res.status(201).json({ message: 'Usuario registrado exitosamente.' });
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      res.status(500).json({ error: 'Error en el servidor.' });
    }
};

// Iniciar sesión
exports.loginUsuario = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    // Validar campos requeridos
    if (!correo || !contraseña) {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
    }

    // Buscar usuario por correo
    const usuarios = await db.query(
      'SELECT * FROM usuarios WHERE correo = ?',
      { replacements: [correo], type: QueryTypes.SELECT }
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const usuario = usuarios[0];

    // Verificar contraseña
    const esValida = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!esValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta.' });
    }

    // Generar token JWT
    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET || 'secreto_super_seguro', {
      expiresIn: '1d',
    });

    res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);
    res.status(500).json({ error: 'Error en el servidor.' });
  }
};

// Obtener usuarios (Solo administradores)
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await db.query(
      'SELECT id, nombre, correo, rol, fecha_creacion FROM usuarios',
      { type: QueryTypes.SELECT }
    );
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error en el servidor.' });
  }
};
