const jwt = require('jsonwebtoken');

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization') || req.query.token;

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado, token no proporcionado.' });
  }

  try {
    // Verificar el token con la clave secreta
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'claveSecreta');
    req.user = verified; // Guardar los datos del usuario en el objeto request
    next(); // Continuar al siguiente middleware o controlador
  } catch (error) {
    return res.status(400).json({ message: 'Token no válido.' });
  }
};

// Middleware para verificar si el usuario es administrador
const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado, no eres administrador.' });
  }
  next();
};

module.exports = { verifyToken, verifyAdmin };
