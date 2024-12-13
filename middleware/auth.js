const jwt = require('jsonwebtoken');

// Clave secreta para el token JWT
const secretKey = process.env.JWT_SECRET || 'secreto_super_seguro';

// Middleware para verificar la autenticación del token
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '') || req.query.token;

    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
    }

    // Verifica el token sin expiración
    const decoded = jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        console.error('Error al verificar el token:', err.message);
        return res.status(403).json({ message: 'Token no válido.' });
      }
      req.user = user; // Almacena los datos del token en `req.user`
      next();
    });
  } catch (error) {
    console.error('Error al verificar el token:', error.message);
    return res.status(403).json({ message: 'Token no válido.' });
  }
};

// Middleware para verificar si el usuario tiene rol de administrador
const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.rol !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Privilegios de administrador requeridos.' });
  }
  next();
};

module.exports = { verifyToken, verifyAdmin };





