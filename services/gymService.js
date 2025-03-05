//Aquí se encuentran los services para el manejo de gimnasios
const Gym = require('../models/gym');
const Admin = require('../models/admin');
const Membresia = require('../models/membresias');
const Asistencia = require('../models/asistencias');
require('dotenv').config();

//Servicio para agregar un gimnasio
const crearGimnasio = async (nombre, direccion, telefono, horario, adminId, imagenUrl) => {
    try {
      //Crear nuevo gimnasio
      const nuevoGym = await Gym.create({
        nombre,
        direccion,
        telefono,
        horario,
        imagen: imagenUrl
      });

      //Obtener el _id del nuevo gimnasio
      const gymId = nuevoGym._id;

      //Actualizar el array de gym_id
      await Admin.findByIdAndUpdate(
        adminId,
        { $push: { gym_id: gymId } },
        { new: true }
      );

      return nuevoGym;
    } catch (error){
      console.error('Error al crear el gimnasio:', error);
      throw new Error('Error al crear el gimnasio');
    }
};

//Servicio para que el admin vea sus gimnasios
const verGimnasios = async (adminId) => {
  try {
      // Buscar el administrador por su ID y obtener su array gym_id
      const admin = await Admin.findById(adminId).select('gym_id');
      if (!admin) {
          throw new Error('Administrador no encontrado');
      }

      // Obtener los gimnasios correspondientes a los gym_id
      const gimnasios = await Gym.find({ _id: { $in: admin.gym_id } });

      return gimnasios;
  } catch (error) {
      console.error('Error en el servicio de obtenerGimnasiosDeAdmin:', error);
      throw new Error('Error al obtener los gimnasios del administrador');
  }
};

// Servicio para editar datos del gimnasio
const editarGimnasio = async (id, updateFields) => {
    try {
        // Actualizamos el gimnasio usando su ID
        const gimnasioActualizado = await Gym.findByIdAndUpdate(
            id,  // ID del gimnasio que se va a actualizar
            { $set: updateFields },  // Solo actualizamos los campos proporcionados
            { new: true }  // Para devolver el documento actualizado
        );

        // Si no se encontró el gimnasio, lanzamos un error
        if (!gimnasioActualizado) {
            throw new Error('Gimnasio no encontrado');
        }

        return gimnasioActualizado;
    } catch (error) {
        console.error('Error al editar gimnasio:', error);
        throw new Error('Error al editar el gimnasio');
    }
};

//Servicio para que el usuario vea los gimnasios a los que puede acceder con su membresía
const verGimnasiosUser = async (membresiaId) => {
  try {
      // Buscar la membresía por su ID y obtener el array de gym_id
      const membresia = await Membresia.findById(membresiaId).select('gym_id');
      if (!membresia) {
          throw new Error('Membresía no encontrada');
      }

      // Obtener los gimnasios correspondientes a los gym_id
      const gimnasios = await Gym.find({ _id: { $in: membresia.gym_id } });

      // Para cada gimnasio, contar los usuarios con una asistencia de tipo "Entrada" sin "Salida"
      const gimnasiosConUsuariosDentro = await Promise.all(gimnasios.map(async (gimnasio) => {
          // Encontrar las asistencias "Entrada" sin "Salida" para este gimnasio
          const usuariosDentro = await Asistencia.aggregate([
              {
                  $match: {
                      gym_id: gimnasio._id,
                      tipo_acceso: 'Entrada'
                  }
              },
              {
                  $lookup: {
                      from: 'asistencias',
                      localField: '_id', // Relacionar la asistencia de entrada
                      foreignField: 'entrada_id', // Campo que se relaciona con la salida
                      as: 'salida'
                  }
              },
              {
                  $match: {
                      salida: { $size: 0 } // Buscar solo las asistencias que no tienen salida
                  }
              },
              {
                  $group: {
                      _id: '$usuario_id', // Agrupar por usuario
                      count: { $sum: 1 }
                  }
              }
          ]);

          return {
              ...gimnasio.toObject(), // Incluimos los datos del gimnasio
              usuariosDentro: usuariosDentro.length // Número de usuarios "dentro" del gimnasio
          };
      }));

      return gimnasiosConUsuariosDentro;
  } catch (error) {
      console.error('Error en el servicio verGimnasiosUser:', error);
      throw new Error('Error al obtener los gimnasios del usuario');
  }
};


module.exports = { crearGimnasio, verGimnasios, editarGimnasio, verGimnasiosUser };