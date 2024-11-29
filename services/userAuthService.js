const jwt = require('jsonwebtoken');
const db = require('../db'); // Conexión a la base de datos
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;
const tokenExpiration = process.env.JWT_EXPIRATION || '2h';

const authenticateUser = async (username, password) => {
  try {
    const result = await db.query(
      'SELECT * FROM usuarios WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username, 
          role: 'usuario', 
          gym_id: user.gym_id // Asegúrate de que gym_id está en la tabla usuarios
        },
        secretKey,
        { expiresIn: tokenExpiration }
      );
      return { token, user };
    }
    return null;
  } catch (error) {
    console.error('Error autenticando al usuario:', error);
    throw new Error('Error al autenticar');
  }
};

module.exports = { authenticateUser };