const userAuthService = require('../services/userAuthService');

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username y contraseña son requeridos' });
  }

  try {
    const authResult = await userAuthService.authenticateUser(username, password);

    if (!authResult) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    res.status(200).json({
      message: 'Login exitoso',
      token: authResult.token,
      user: authResult.user,
    });
  } catch (error) {
    console.error('Error en el proceso de login del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { loginUser };
