//Aquí se encuentran los services para el manejo de gimnasios
const Gym = require('../models/gym');
const Admin = require('../models/admin');
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

//Servicio para ver gimnasios
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

module.exports = { crearGimnasio, verGimnasios, editarGimnasio };