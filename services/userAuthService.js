const jwt = require('jsonwebtoken');
const db = require('../db'); // Conexión a la base de datos
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;
const tokenExpiration = process.env.JWT_EXPIRATION || '2h';

const authenticateUser = async (username, password) => {
  try {
    // Busca al usuario en la base de datos
    const result = await db.query(
      'SELECT * FROM usuarios WHERE username = $1 AND password = $2',
      [username, password]
    );

    // Si no se encuentra el usuario, devuelve null
    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];

    // Genera un token JWT para el usuario
    const token = jwt.sign(
      { id: user.id, username: user.username, role: 'usuario' },
      secretKey,
      { expiresIn: tokenExpiration }
    );

    return { token, user };
  } catch (error) {
    console.error('Error autenticando al usuario:', error);
    throw new Error('Error al autenticar');
  }
};

module.exports = { authenticateUser };
