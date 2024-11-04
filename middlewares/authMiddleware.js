const jwt = require('jsonwebtoken');
require('dotenv').config(); // Cargar las variables de entorno
const secretKey = process.env.JWT_SECRET; // Utilizar la clave secreta del archivo .env

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, secretKey);
      req.user = decoded; // Guardar el usuario decodificado en la solicitud
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }
  } else {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
};

module.exports = authMiddleware;

console.log('Auth Header:', authHeader);
console.log('Token:', token);
