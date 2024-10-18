const authService = require('../services/authService');

const login = async (req, res) => {
  const { username, password } = req.body;

  // Verificar si faltan el nombre de usuario o la contraseña
  if (!username || !password) {
    return res.status(400).json({ message: 'Username y contraseña son requeridos' });
  }

  try {
    // Llamar a la función de autenticación y esperar el resultado
    const authResult = await authService.authenticateUser(username, password);

    if (!authResult) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Responder con el token y la información del usuario si las credenciales son válidas
    res.status(200).json({
      message: 'Login exitoso',
      token: authResult.token,
      user: authResult.user // información del usuario (opcional)
    });
  } catch (error) {
    // Manejar errores inesperados
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

module.exports = { login };
