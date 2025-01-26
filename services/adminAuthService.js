//Aquí se van a encontrar todos los services para crear, validar y editar a los administradores
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;
const tokenExpiration = process.env.JWT_EXPIRATION || '2h';

//Servicio para agregar un administrador
const crearAdministrador = async (gym_id, username, password, nombre_completo, email, telefono, fecha_registro) => {
  try{
    const result = await db.query(
      'INSERT INTO administradores(gym_id, username, password, nombre_completo, email, telefono, fecha_registro) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [gym_id, username, password, nombre_completo, email, telefono, fecha_registro]
    );
    return result.rows[0];
  } catch (error){
    console.error('Erros al agregar un administrador nuevo:', error);
    throw new Error('Error al agregar al administrador nuevo');
  }
};

//Servicio para hacer login como administrador
const authenticateAdmin = async (username, password) => {
  try {
    const result = await db.query(
      'SELECT * FROM administradores WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length > 0) {
      const admin = result.rows[0];
      const token = jwt.sign(
        { 
          id: admin.id, 
          username: admin.username, 
          role: 'administrador', 
          gym_id: admin.gym_id
        },
        secretKey,
        { expiresIn: tokenExpiration }
      );
      return { token, admin };
    }
    return null;
  } catch (error) {
    console.error('Error autenticando al administrador:', error);
    throw new Error('Error al autenticar');
  }
};

module.exports = { crearAdministrador, authenticateAdmin };
