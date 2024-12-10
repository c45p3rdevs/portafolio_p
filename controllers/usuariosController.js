const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Conexión a la base de datos

// Registrar un nuevo usuario
exports.registroUsuario = async (req, res) => {
    const { nombre, correo, contraseña, rol } = req.body;

    try {
        // Verificar si el correo ya está registrado
        const [existeUsuario] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (existeUsuario.length > 0) {
            return res.status(400).json({ error: 'El correo ya está registrado.' });
        }

        // Validar que todos los campos estén presentes
        if (!nombre || !correo || !contraseña) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        // Cifrar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashContraseña = await bcrypt.hash(contraseña, salt);

        // Insertar usuario en la base de datos
        await db.query('INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES (?, ?, ?, ?)', [
            nombre,
            correo,
            hashContraseña,
            rol || 'usuario',
        ]);

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
        // Validar que los campos no estén vacíos
        if (!correo || !contraseña) {
            return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
        }

        // Buscar usuario por correo
        const [usuarios] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
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
        // Validación adicional: Asegurarnos de que la función esté protegida por middleware
        if (!req.user || req.user.rol !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado: Solo para administradores.' });
        }

        const [usuarios] = await db.query('SELECT id, nombre, correo, rol, fecha_creacion FROM usuarios');
        res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error en el servidor.' });
    }
};

