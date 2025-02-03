const Plan = require('../models/planes');
require('dotenv').config();

// Servicio para agregar un tipo de plan de membresía
const crearPlanes = async (gym_id, nombre, descripcion, costo, duracion_meses) => {
    try {
        const nuevoPlan = new Plan({
            gym_id,
            nombre,
            descripcion,
            costo,
            duracion_meses,
            activa: true // Definimos que el nuevo plan es activo por defecto
        });
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
            .select('nombre descripcion costo duracion_meses') // Solo seleccionar los campos necesarios
            .sort({ costo: 1 }); // Ordenar por costo de menor a mayor
        return planes;
    } catch (error) {
        console.error('Error al mostrar los planes de membresía:', error);
        throw new Error('Error al mostrar los planes de membresía');
    }
};

// Servicio para editar un plan existente de membresía
const editarPlanes = async (id, gymId, nombre, descripcion, costo, duracion_meses) => {
    try {
        const fieldsToUpdate = {};

        if (nombre) fieldsToUpdate.nombre = nombre;
        if (descripcion) fieldsToUpdate.descripcion = descripcion;
        if (costo) fieldsToUpdate.costo = costo;
        if (duracion_meses) fieldsToUpdate.duracion_meses = duracion_meses;

        if (Object.keys(fieldsToUpdate).length === 0) {
            throw new Error('No se han proporcionado datos para actualizar.');
        }

        // Buscar el plan por su id y gym_id, y actualizarlo
        const planActualizado = await Plan.findOneAndUpdate(
            { _id: id, gym_id: gymId },
            { $set: fieldsToUpdate },
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