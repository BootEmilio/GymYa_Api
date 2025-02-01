//Aquí se van a encontrar todos los services para crear, validar y editar a los administradores
const mongoose = require('mongoose');
const Gym = require('../models/gym');
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;
const tokenExpiration = process.env.JWT_EXPIRATION || '2h';

//Servicio para agregar el primer administrador
const registro = async (username, password, nombre_completo, email, telefono) => {
    const session = await mongoose.startSession();  // Iniciar una sesión para la transacción
    session.startTransaction();

    try {
      //Creamos el nuevo gimnasio al que pertenecerá el administrador
      const nuevoGimnasio = await Gym.create([{
        nombre: 'Nombre del gimnasio',
        direccion: 'Dirección del gimnasio',
        telefono: 'Teléfono del gimnasio',
        administradores: [],
        planes_membresias: [],
      }], { session });

      const gym_id = nuevoGimnasio[0]._id; //Obtenemos el objectId del gimnasio nuevo que creamos

      //Creamos el primer administrador
      const nuevoAdmin = await Admin.create([{
        gym_id,
        username,
        password,
        nombre_completo,
        email,
        telefono
      }], { session });

      const admin_id = nuevoAdmin[0]._id; //Obtenemos el objectId del administrador que creamos

      await Gym.findByIdAndUpdate(
        gym_id,
        { $push: { administradores: admin_id } }, //Agregamos el ObjectId del administrador en el array administradores
        { session, new: true }
      );

      await session.commitTransaction();
      session.endSession();

      return { success: true, message: 'Registro exitoso', gimnasio: nuevoGimnasio[0], admin: nuevoAdmin[0] };

    } catch (error){
      await session.abortTransaction();  // Revertir la transacción en caso de error
      session.endSession();
      console.error('Erros al registrar el primer administrador:', error);
      throw new Error('Error al registrar el primer administrador');
    }
};

/*
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
*/

//Servicio para hacer login como administrador
const authenticateAdmin = async (username, password) => {
  try {
    // Buscar el administrador por username
    const admin = await Admin.findOne({ username });

    if (!admin) {
      throw new Error('Administrador no encontrado');
    }

     // Comparación temporal de contraseñas sin bcrypt (¡NO ES SEGURO!)
    if (password !== admin.password) {
      throw new Error('Contraseña incorrecta');
    }

    const token = jwt.sign(
      { 
        id: admin._id, //Ahora retornamos el ObjectId
        username: admin.username, 
        role: 'administrador',
        gym_id: admin.gym_id
      },
      secretKey,
      { expiresIn: tokenExpiration }
    );

    return { token, admin };
  } catch (error) {
    console.error('Error autenticando al administrador:', error);
    throw new Error('Error al autenticar');
  }
};

module.exports = { registro, authenticateAdmin };
