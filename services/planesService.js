const Plan = require('../models/planes');
const Membresia = require('../models/membresias');
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

//Servicio para que un usuario vea los planes de membresía disponibles
const mostrarPlanesUser = async (membresiaId) => {
    try {
        // Buscar la membresía por su ID para obtener el plan_id
        const membresia = await Membresia.findById(membresiaId).populate('plan_id');

        // Obtener los gym_id referenciados en el plan de la membresía
        const gymIds = membresia.plan_id.gym_id;

        // Buscar todos los planes de membresía que estén disponibles en los mismos gimnasios referenciados
        const planesDisponibles = await Plan.aggregate([
            { $match: { gym_id: { $in: gymIds } } }, // Filtrar los planes que tienen gimnasios en gym_id
            {
                $lookup: {
                    from: 'gimnasios', // Colección de gimnasios
                    localField: 'gym_id', // Campo gym_id en los planes
                    foreignField: '_id', // Campo _id en la colección gimnasios
                    as: 'gimnasios', // Asociar gimnasios a los planes
                }
            },
            {
                $project: {
                    nombre: 1, // Mostrar el nombre del plan
                    precio: 1, // Mostrar el precio del plan
                    gimnasios: '$gimnasios.nombre', // Mostrar los nombres de los gimnasios
                }
            }
        ]);

        // Verificar si no se encontraron planes
        if (planesDisponibles.length === 0) {
            return { error: 'No se encontraron planes de membresía disponibles en estos gimnasios' };
        }

        return planesDisponibles;
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

const eliminarPlan = async (planId, gymId) => {
    try {
        // Actualizar el plan para marcarlo como inactivo
        const planEliminado = await Plan.findOneAndUpdate(
            { _id: planId, gym_id: { $in: [gymId] } }, // Usar $in para verificar si el gymId está en el array de gym_id
            { $set: { activa: false } },               // Cambiar el estado a inactivo
            { new: true }
        );

        // Verificar si se encontró y eliminó el plan
        if (!planEliminado) {
            return null; // Retornar null si no se encontró el plan
        }

        // Devolver el plan eliminado
        return planEliminado;
    } catch (error) {
        console.error('Error al eliminar el plan:', error);
        throw new Error('Error al eliminar el plan');
    }
};

module.exports = { crearPlanes, mostrarPlanes, mostrarPlanesUser, editarPlanes, eliminarPlan };