const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'secreto_super_seguro';

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '') || req.query.token;

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado, token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error.message);
    return res.status(403).json({ message: 'Token no válido.' });
  }
};

const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.rol !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado, no eres administrador.' });
  }
  next();
};

module.exports = { verifyToken, verifyAdmin };


