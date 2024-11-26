const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, secretKey);
      req.user = decoded; // Guardar el usuario decodificado en la solicitud
      next();
    } catch (err) {
      console.error('Error al verificar el token:', err.message);
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }
  } else {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
};

module.exports = authMiddleware;
