//Aquí se encuentran los services para el manejo de gimnasios
const Gym = require('../models/gym');
require('dotenv').config();


/*
//Servicio para agregar un gimnasio
const crearGimnasio = async (nombre, direccion, telefono, fechaRegistro) => {
    try {
      const result = await db.query(
        'INSERT INTO gimnasios(nombre, direccion, telefono, fecha_registro) VALUES($1,$2,$3,$4) RETURNING *',
        [nombre, direccion, telefono, fechaRegistro]
      );
      return result.rows[0];
    } catch (error){
      console.error('Erros al crear un gimnasio nuevo:', error);
      throw new Error('Error al crear el gimnasio');
    }
};
*/

// Servicio para editar datos del gimnasio
const editarGimnasio = async (id, nombre, direccion, telefono) => {
    try {
        // Construimos un objeto con los campos que fueron proporcionados
        const updateFields = {};

        if (nombre) updateFields.nombre = nombre;
        if (direccion) updateFields.direccion = direccion;
        if (telefono) updateFields.telefono = telefono;

        // Si no se proporcionaron campos, lanzamos un error
        if (Object.keys(updateFields).length === 0) {
            throw new Error('No se han proporcionado datos para actualizar.');
        }

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

module.exports = { editarGimnasio };