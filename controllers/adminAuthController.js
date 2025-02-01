const AuthAdminService = require('../services/adminAuthService');

//Controlador para registrar primer administrador
const registro = async (req, res) => {
  try{
    const {username, password, nombre_completo, email, telefono} = req.body;

    // Validar que todos los campos estén presentes
    if (!username || !password || !nombre_completo || !email || !telefono) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const primerAdmin = await AuthAdminService.registro(username, password, nombre_completo, email, telefono);
    res.status(201).json(primerAdmin);
  }catch (error) {
    res.status(500).json({error: 'Error al registrar el primer administrador'});
  }
};

/*
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
*/

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

module.exports = { registro, loginAdmin };