const AuthAdminService = require('../services/adminAuthService');

//Controlador para crear administrador
const crearAdministrador = async (req, res) => {
  try{
    const {gym_id, username, password, nombre_completo, email, telefono, fecha_registro} = req.body;
    const nuevoAdmin = await AuthAdminService.crearAdministrador(gym_id, username, password, nombre_completo, email, telefono, fecha_registro);
    res.status(201).json(nuevoAdmin);
  }catch (error){
    res.status(500).json({error: 'Error al crear nuevo administrador'});
  }
};

//Controlador para hacer login como administrador
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

module.exports = { crearAdministrador, loginAdmin };