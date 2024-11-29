const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;
const tokenExpiration = process.env.JWT_EXPIRATION || '2h';

const authenticateAdmin = async (username, password) => {
  try {
    const result = await db.query(
      'SELECT * FROM administradores WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length > 0) {
      const admin = result.rows[0];
      const token = jwt.sign(
        { 
          id: admin.id, 
          username: admin.username, 
          role: 'administrador', 
          gym_id: admin.gym_id // Asegúrate de que gym_id está en la tabla administradores
        },
        secretKey,
        { expiresIn: tokenExpiration }
      );
      return { token, admin };
    }
    return null;
  } catch (error) {
    console.error('Error autenticando al administrador:', error);
    throw new Error('Error al autenticar');
  }
};


module.exports = { authenticateAdmin };
