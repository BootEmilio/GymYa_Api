const adminService = require('../services/adminService');
const Admin = require('../models/admin');
const bcrypt = require('bcrypt');

//Controlador para registrar primer administrador
const registro = async (req, res) => {
  try{
    const {username, password, nombre_completo, email, telefono} = req.body;

    // Validar que todos los campos estén presentes
    if (!username || !password || !nombre_completo || !email || !telefono) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Verificar si el username ya existe
    const adminExistente = await Admin.findOne({ username });
    if (adminExistente) {
        return res.status(400).json({ error: 'El nombre de usuario ya está registrado' });
    }

    // Verificar si el email ya existe
    const emailExistente = await Admin.findOne({ email });
    if (emailExistente) {
        return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Verificar si el teléfono ya existe
    const telefonoExistente = await Admin.findOne({ telefono });
    if (telefonoExistente) {
        return res.status(400).json({ error: 'El teléfono ya está registrado' });
    }

    const adminPrincipal = await adminService.registro(username, password, nombre_completo, email, telefono);
    res.status(201).json(adminPrincipal);
  }catch (error) {
    console.error('Error en el controlador de registro:', error);
    res.status(500).json({ error: 'Error al registrar el administrador' });
  }
};

//Controlador para hacer login como administrador
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    //Validar que se pasen los datos
    if (!username || !password) {
      return res.status(400).json({ message: 'Username y contraseña son requeridos' });
    }

    // Buscar el administrador por username
    const admin = await Admin.findOne({ username });  
    if (!admin) {
      throw new Error('Administrador no encontrado');
    }    
     
    // Comparar la contraseña usando bcrypt
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new Error('Contraseña incorrecta');
    }

    const authResult = await adminService.authenticateAdmin(admin);

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