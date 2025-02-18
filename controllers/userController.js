const user = require('../models/usuarios');
const userAuthService = require('../services/userService');
const bcrypt = require('bcryptjs');

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email y contraseña son requeridos' });
    }

    // Buscar el administrador por username
    const usuario = await user.findOne({ email });  
    if (!usuario) {
      throw res.status(400).json({ message: 'Correo electronico no encontrado no encontrado'});
    }

    // Comparar la contraseña usando bcrypt
    const isPasswordValid = await bcrypt.compare(password, usuario.password);
    if (!isPasswordValid) {
      throw res.status(400).json({ message: 'Contraseña incorrecta'});
    }

    const authResult = await userAuthService.authenticateUser(email, password);

    if (!authResult) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    res.status(200).json({
      message: 'Login exitoso',
      token: authResult.token,
      user: authResult.usuario,
    });
  } catch (error) {
    console.error('Error en el proceso de login del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { loginUser };
