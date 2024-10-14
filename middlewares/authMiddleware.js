const jwt = require('jsonwebtoken');
const secretKey = 'Calamardo-Totelini'; // Mismo valor que el del authService

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
