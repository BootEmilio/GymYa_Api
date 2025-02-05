const user = require('../models/usuarios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;
const tokenExpiration = process.env.JWT_EXPIRATION || '2h';

// Servicio para hacer login como usuario
const authenticateUser = async (username, password) => {
  try {
    // Buscar el usuario por username
    const usuario = await user.findOne({ username });

    // Verificar si el usuario existe y la contraseña es correcta
    if (!usuario || usuario.password !== password) {
      return null; // Retornar null si no coincide el username o la contraseña
    }

    const token = jwt.sign(
      {
        id: usuario._id,
        username: usuario.username,
        role: 'user',
        gym_id: usuario.gym_id
      },
      secretKey,
      { expiresIn: tokenExpiration }
    );

    return { token, usuario };  
  } catch (error) {
    console.error('Error autenticando al usuario:', error);
    throw new Error('Error al autenticar');
  }
};

module.exports = { authenticateUser };