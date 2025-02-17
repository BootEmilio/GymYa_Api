const Plan = require('../models/planes');
require('dotenv').config();

// Servicio para agregar un tipo de plan de membresía
const crearColaboraciones = async (gymIds, entrenadorId, nombre, descripcion, costo, duracion_meses, duracion_semanas, duracion_dias) => {
    try {
        const nuevoPlan = new Plan({
            gym_id: gymIds,
            entrenadorId,
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
        console.error('Error al crear colaboración:', error);
        throw new Error('Error al crear crear colaboración');
    }
};

// Servicio para mostrar los planes de membresía activos
const mostrarColaboraciones = async (entrenadorId) => {
    try {
        // Filtrar por gym_id y solo planes que estén activos (activa: true)
        const planes = await Plan.find({ entrenador_id: entrenadorId, activa: true })
            .select('nombre descripcion costo duracion_meses duracion_semanas duracion_dias') // Solo seleccionar los campos necesarios
            .sort({ costo: 1 }); // Ordenar por costo de menor a mayor
        return planes;
    } catch (error) {
        console.error('Error al mostrar las colaboraciones', error);
        throw new Error('Error al mostrar las colaboraciones');
    }
};

// Servicio para editar un plan existente de membresía
const editarColaboracion = async (planId, entrenadorId, updateFields, unsetFields) => {
    try {
        // Buscar el plan por su id y gym_id, y actualizarlo
        const planActualizado = await Plan.findOneAndUpdate(
            { _id: planId, entrenador_id: entrenadorId }, // Filtro para asegurar que la colaboración le pertenece al entrenador
            { 
                $set: updateFields, // Campos a actualizar
                $unset: unsetFields // Campos a eliminar
            },
            { new: true } // Retorna la colaboracion actualizado
        );

        if (!planActualizado) {
            throw new Error('Colaboración no encontrada o no pertenece al entrenador');
        }

        return planActualizado;
    } catch (error) {
        console.error('Error al editar el plan:', error);
        throw new Error('Error al editar el plan');
    }
};

// Servicio para "eliminar" planes de membresía (desactivarlo)
const eliminarColaboracion = async (id, entrenadorId) => {
    try {
        // "Eliminar" el plan estableciendo activa a false
        const planEliminado = await Plan.findOneAndUpdate(
            { _id: id, entrenador_id: entrenadorId },
            { $set: { activa: false } }, // Cambiar el estado a inactivo
            { new: true }
        );

        return planEliminado;
    } catch (error) {
        console.error('Error al eliminar el plan:', error);
        throw new Error('Error al eliminar el plan');
    }
};

module.exports = { crearColaboraciones, mostrarColaboraciones, editarColaboracion, eliminarColaboracion };