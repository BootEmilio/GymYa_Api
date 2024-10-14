const authService = require('../services/authService');

const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username y contraseña son requeridos' });
  }

  const authResult = authService.authenticateUser(username, password);

  if (!authResult) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  res.status(200).json({
    message: 'Login exitoso',
    token: authResult.token,
    user: authResult.user // información del usuario (opcional)
  });
};

module.exports = { login };
