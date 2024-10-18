const jwt = require('jsonwebtoken');
require('dotenv').config(); // Cargar variables de entorno
const secretKey = process.env.JWT_SECRET; // Obtener la clave secreta desde el .env

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]; // Extraer el token

    try {
      const decoded = jwt.verify(token, secretKey); // Verificar el token con la clave secreta del .env
      req.user = decoded; // Guardar el usuario decodificado en la solicitud
      next(); // Continuar al siguiente middleware o ruta
    } catch (err) {
      return res.status(401).json({ message: 'Token inválido o expirado' }); // Manejar errores de verificación
    }
  } else {
    return res.status(401).json({ message: 'Token no proporcionado' }); // Caso en que no haya token
  }
};

module.exports = authMiddleware;
