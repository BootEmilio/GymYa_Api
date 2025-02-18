const Plan = require('../models/planes');
require('dotenv').config();

// Servicio para agregar un tipo de plan de membresía
const crearPlanes = async (gymIds, nombre, descripcion, costo, duracion_meses, duracion_semanas, duracion_dias) => {
    try {
        const nuevoPlan = new Plan({
            gym_id: gymIds,
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
const editarPlanes = async (planId, gymId, updateFields, unsetFields) => {
    try {
        // Buscar el plan por su id y gym_id, y actualizarlo
        const planActualizado = await Plan.findOneAndUpdate(
            { _id: planId, gym_id: gymId }, // Filtro para asegurar que el plan pertenezca al gimnasio
            { 
                $set: updateFields, // Campos a actualizar
                $unset: unsetFields // Campos a eliminar
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
const eliminarPlan = async (planId, gymId) => {
    try {
        // "Eliminar" el plan estableciendo activa a false
        const planEliminado = await Plan.findOneAndUpdate(
            { _id: planId, gym_id: gymId, activa: true }, // Buscar solo planes activos
            { $set: { activa: false } }, // Cambiar el estado a inactivo
            { new: true }
        );

        // Devolver el plan eliminado o null si no se encontró
        return planEliminado;
    } catch (error) {
        console.error('Error al eliminar el plan:', error);
        throw new Error('Error al eliminar el plan');
    }
};

module.exports = { crearPlanes, mostrarPlanes, editarPlanes, eliminarPlan };