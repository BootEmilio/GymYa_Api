// services/authService.js
const jwt = require('jsonwebtoken');
const db = require('../db'); // Asegúrate de tener configurada la conexión a la base de datos
require('dotenv').config();

const secretKey = process.env.JWT_SECRET; // Toma la clave desde el archivo .env
const tokenExpiration = process.env.JWT_EXPIRATION || '1h'; // Tiempo de expiración del token

// Autenticar administrador en la base de datos
const authenticateAdmin = async (username, password) => {
  try {
    // Consulta a la base de datos para encontrar el administrador
    const result = await db.query(
      'SELECT * FROM administradores WHERE username = $1 AND password = $2',
      [username, password]
    );

    // Si encuentra al usuario, crea un token y devuelve sus datos
    const admin = result.rows[0];
    if (admin) {
      const token = jwt.sign(
        { id: admin.id, username: admin.username, role: 'administrador' }, // Asegúrate de incluir el ID
        secretKey,
        { expiresIn: tokenExpiration }
      );

      return { token, admin }; // Devuelve el token y los datos del administrador
    }
    return null; // Si no se encuentra el usuario, devuelve null
  } catch (error) {
    console.error('Error autenticando al administrador:', error);
    throw new Error('Error al autenticar');
  }
};

module.exports = { authenticateAdmin };
