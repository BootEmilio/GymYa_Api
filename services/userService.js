const user = require('../models/usuarios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;
const tokenExpiration = process.env.JWT_EXPIRATION || '2h';

// Servicio para hacer login como usuario
const authenticateUser = async (usuario) => {
  try {
    const token = jwt.sign(
      {
        id: usuario._id,
        email: usuario.email,
        role: 'user',
        membresia_id: usuario.membresia_id
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

//Servicio para editar usuario
const editarUsuario = async (usuarioId, updateFields) => {
  try{
    // Buscar y actualizar el usuario
    const usuarioActualizado = await user.findByIdAndUpdate(
      usuarioId,
      { $set: updateFields }, // Actualizar solo los campos proporcionados
      { new: true } // Devolver el documento actualizado
    );

    return usuarioActualizado;
  }catch (error) {
    console.error('Error editanto al usuario', error);
    throw new Error('Error editanto al usuario');
  }
};

module.exports = { authenticateUser, editarUsuario };