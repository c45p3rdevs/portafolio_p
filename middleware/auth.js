const jwt = require('jsonwebtoken');

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '') || req.query.token;

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado, token no proporcionado.' });
  }

  try {
    // Verificar el token con la clave secreta
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'claveSecreta');
    req.user = verified; // Guardar los datos del usuario en el objeto request
    next(); // Continuar al siguiente middleware o controlador
  } catch (error) {
    console.error('Error al verificar el token:', error.message);
    return res.status(403).json({ message: 'Token no válido o expirado.' });
  }
};

// Middleware para verificar si el usuario es administrador
const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.rol !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado, no eres administrador.' });
  }
  next();
};

module.exports = { verifyToken, verifyAdmin };

