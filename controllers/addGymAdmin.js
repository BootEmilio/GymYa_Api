//A ver que pedo

const db = require('../db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;
const tokenExpiration = process.env.JWT_EXPIRATION || '2h';

const registerGym = async (req, res) => {
  try {
    const { gymName, adminUsername, adminPassword, adminNombreCompleto, adminEmail, adminTelefono } = req.body;

    if (!gymName || !adminUsername || !adminPassword || !adminEmail) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    // Crear gimnasio
    const gymResult = await db.query(
      'INSERT INTO gimnasios (nombre, direccion, telefono) VALUES ($1, $2, $3) RETURNING id',
      [gymName, req.body.gymDireccion || null, req.body.gymTelefono || null]
    );
    const gymId = gymResult.rows[0].id;

    // Crear administrador principal
    const adminResult = await db.query(
      'INSERT INTO administradores (gym_id, username, password, nombre_completo, email, telefono) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [gymId, adminUsername, adminPassword, adminNombreCompleto || null, adminEmail, adminTelefono || null]
    );

    // Generar token JWT para el administrador
    const token = jwt.sign({ id: adminResult.rows[0].id, gym_id: gymId, role: 'administrador' }, secretKey, {
      expiresIn: tokenExpiration,
    });

    res.status(201).json({
      message: 'Gimnasio y administrador registrados exitosamente',
      token,
      gymId,
    });
  } catch (error) {
    console.error('Error al registrar gimnasio y administrador:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { registerGym };
