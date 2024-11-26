const jwt = require('jsonwebtoken');
const db = require('../db'); // Asegúrate de tener configurada la conexión a la base de datos
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;
const tokenExpiration = process.env.JWT_EXPIRATION || '2h';

const authenticate = async (username, password) => {
  try {
    // Buscar en la tabla de administradores
    const adminResult = await db.query(
      'SELECT * FROM administradores WHERE username = $1 AND password = $2',
      [username, password]
    );
    if (adminResult.rows.length > 0) {
      const admin = adminResult.rows[0];
      const token = jwt.sign(
        { id: admin.id, username: admin.username, role: 'administrador' },
        secretKey,
        { expiresIn: tokenExpiration }
      );
      return { token, user: admin, role: 'administrador' };
    }

    // Buscar en la tabla de usuarios
    const userResult = await db.query(
      'SELECT * FROM usuarios WHERE username = $1 AND password = $2',
      [username, password]
    );
    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      const token = jwt.sign(
        { id: user.id, username: user.username, role: 'usuario' },
        secretKey,
        { expiresIn: tokenExpiration }
      );
      return { token, user, role: 'usuario' };
    }

    return null; // No se encontró ni en administradores ni en usuarios
  } catch (error) {
    console.error('Error autenticando al usuario:', error);
    throw new Error('Error al autenticar');
  }
};

module.exports = { authenticate };
