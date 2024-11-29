const AuthAdminService = require('../services/adminAuthService');

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username y contraseña son requeridos' });
  }

  try {
    const authResult = await AuthAdminService.authenticateAdmin(username, password);

    if (!authResult) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    res.status(200).json({
      message: 'Login exitoso',
      token: authResult.token,
      admin: authResult.admin,
    });
  } catch (error) {
    console.error('Error en el proceso de login del administrador:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username y contraseña son requeridos' });
  }

  try {
    const authResult = await AuthAdminService.authenticateUser(username, password);

    if (!authResult) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    res.status(200).json({
      message: 'Login exitoso',
      token: authResult.token,
      admin: authResult.admin,
    });
  } catch (error) {
    console.error('Error en el proceso de login del administrador:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { loginAdmin, loginUser };