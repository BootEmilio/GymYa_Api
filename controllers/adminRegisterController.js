const db = require('../db');
const bcrypt = require('bcrypt'); // Si usas encriptación de contraseñas

const registerAdmin = async (req, res) => {
  try {
    // Validar que el usuario que hace la solicitud sea un administrador
    if (req.user.role !== 'administrador') {
      return res.status(403).json({ message: 'Acceso denegado: solo administradores pueden registrar nuevos administradores' });
    }

    const { username, password, nombre_completo, email } = req.body;

    // Validar los datos requeridos
    if (!username || !password || !nombre_completo || !email) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    // Guardar el administrador en la base de datos
    await db.query(
      'INSERT INTO administradores (username, password, nombre_completo, email) VALUES ($1, $2, $3, $4)',
      [username, hashedPassword, nombre_completo, email]
    );

    res.status(201).json({ message: 'Administrador registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar el administrador:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { registerAdmin };
