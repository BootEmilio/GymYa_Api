const Plan = require('../models/planes');
require('dotenv').config();

// Servicio para agregar un tipo de plan de membresía
const crearPlanes = async (gym_id, nombre, descripcion, costo, duracion_meses, duracion_semanas, duracion_dias) => {
    try {
        const nuevoPlan = new Plan({
            gym_id,
            nombre,
            descripcion,
            costo,
            activa: true // Definimos que el nuevo plan es activo por defecto
        });

        // Solo agregar los campos de duración si se proporcionan
        if (duracion_meses !== undefined) {
            nuevoPlan.duracion_meses = duracion_meses;
        }

        if (duracion_semanas !== undefined) {
            nuevoPlan.duracion_semanas = duracion_semanas;
        }

        if (duracion_dias !== undefined) {
            nuevoPlan.duracion_dias = duracion_dias;
        }

        const result = await nuevoPlan.save();
        return result;
    } catch (error) {
        console.error('Error al crear membresía:', error);
        throw new Error('Error al crear la membresía');
    }
};

// Servicio para mostrar los planes de membresía activos
const mostrarPlanes = async (gymId) => {
    try {
        // Filtrar por gym_id y solo planes que estén activos (activa: true)
        const planes = await Plan.find({ gym_id: gymId, activa: true })
            .select('nombre descripcion costo duracion_meses duracion_semanas duracion_dias') // Solo seleccionar los campos necesarios
            .sort({ costo: 1 }); // Ordenar por costo de menor a mayor
        return planes;
    } catch (error) {
        console.error('Error al mostrar los planes de membresía:', error);
        throw new Error('Error al mostrar los planes de membresía');
    }
};

// Servicio para editar un plan existente de membresía
const editarPlanes = async (id, gymId, nombre, descripcion, costo, duracion_meses, duracion_semanas, duracion_dias) => {
    try {
        const fieldsToUpdate = {};

        if (nombre) fieldsToUpdate.nombre = nombre;
        if (descripcion) fieldsToUpdate.descripcion = descripcion;
        if (costo) fieldsToUpdate.costo = costo;

        // Si duracion_meses es proporcionado, lo actualizamos; si es 0, lo eliminamos
        if (duracion_meses !== undefined) {
            if (duracion_meses === 0) {
                fieldsToUnset.duracion_meses = ""; // Indicamos que queremos eliminar este campo
            } else {
                fieldsToUpdate.duracion_meses = duracion_meses;
            }
        }

        // Si duracion_semanas es proporcionado, lo actualizamos; si es 0, lo eliminamos
        if (duracion_semanas !== undefined) {
            if (duracion_semanas === 0) {
                fieldsToUnset.duracion_semanas = ""; // Eliminamos este campo
            } else {
                fieldsToUpdate.duracion_semanas = duracion_semanas;
            }
        }

        // Si duracion_dias es proporcionado, lo actualizamos; si es 0, lo eliminamos
        if (duracion_dias !== undefined) {
            if (duracion_dias === 0) {
                fieldsToUnset.duracion_dias = ""; // Eliminamos este campo
            } else {
                fieldsToUpdate.duracion_dias = duracion_dias;
            }
        }

        // Validamos que haya algo que actualizar o eliminar
        if (Object.keys(fieldsToUpdate).length === 0 && Object.keys(fieldsToUnset).length === 0) {
            throw new Error('No se han proporcionado datos para actualizar o eliminar.');
        }

        // Buscar el plan por su id y gym_id, y actualizarlo
        const planActualizado = await Plan.findOneAndUpdate(
            { _id: id, gym_id: gymId },
            { 
                $set: fieldsToUpdate,
                $unset: fieldsToUnset //Elimina campos que deben de quedar como undefined
            },
            { new: true } // Retorna el plan actualizado
        );

        if (!planActualizado) {
            throw new Error('Plan no encontrado o no pertenece al gimnasio');
        }

        return planActualizado;
    } catch (error) {
        console.error('Error al editar el plan:', error);
        throw new Error('Error al editar el plan');
    }
};

// Servicio para "eliminar" planes de membresía (desactivarlo)
const eliminarPlan = async (id, gymId) => {
    try {
        // "Eliminar" el plan estableciendo activa a false
        const planEliminado = await Plan.findOneAndUpdate(
            { _id: id, gym_id: gymId },
            { $set: { activa: false } }, // Cambiar el estado a inactivo
            { new: true }
        );

        if (!planEliminado) {
            throw new Error('Plan no encontrado o no pertenece al gimnasio');
        }

        return planEliminado;
    } catch (error) {
        console.error('Error al eliminar el plan:', error);
        throw new Error('Error al eliminar el plan');
    }
};

module.exports = { crearPlanes, mostrarPlanes, editarPlanes, eliminarPlan };