const jwt = require('jsonwebtoken');
require('dotenv').config(); // Cargar las variables de entorno

const secretKey = process.env.JWT_SECRET; // Utilizar la clave secreta del archivo .env
console.log('JWT_SECRET en authMiddleware:', secretKey); // Imprimir el valor de JWT_SECRET

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, secretKey);
      req.user = decoded; // Guardar el usuario decodificado en la solicitud
      next();
    } catch (err) {
      console.error('Error al verificar el token:', err.message); // Imprimir mensaje de error
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }
  } else {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
};

module.exports = authMiddleware;
