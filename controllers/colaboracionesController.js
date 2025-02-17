const planesService = require('../services/colaboracionesService')

//Controlador para agregar colaboraciones
const crearColaboraciones = async (req, res) => {
    try{
        const { nombre, descripcion, costo, duracion_meses, duracion_semanas, duracion_dias, gymIds } = req.body;
        const entrenadorId = req.user.id; // _id del entrenador

        // Validar que al menos un gym_id o un entrenador_id esté presente
        if (!gymIds || gymIds.length === 0) {
            throw new Error('Debe proporcionar al menos un gimnasio.');
        }

        // Validar que al menos una duración sea proporcionada
        if (duracion_meses === undefined && duracion_semanas === undefined && duracion_dias === undefined) {
            return res.status(400).json({ error: 'Debe proporcionar al menos una duración (meses, semanas o días).' });
        }

        // Validar que las duraciones no sean negativas
        if ((duracion_meses !== undefined && duracion_meses < 0) ||
            (duracion_semanas !== undefined && duracion_semanas < 0) ||
            (duracion_dias !== undefined && duracion_dias < 0)) {
            return res.status(400).json({ error: 'Las duraciones no pueden ser negativas.' });
        }

        //Validaciones para el costo
        if (costo === undefined || costo<0) {
            return res.status(400).json({ error: 'El costo debe de estar definido y no puede ser negativo.' });
        }

        const nuevoPlan = await planesService.crearPlanes(gymIds, entrenadorId, nombre, descripcion, costo, duracion_meses, duracion_semanas, duracion_dias);
        res.status(201).json(nuevoPlan);
    }catch (error) {
        res.status(500).json({error: 'Error al crear nueva colaboración'});
    }
};

//Controlador para mostrar planes de membresía
const mostrarColaboraciones = async (req, res) => {
    try {
        const entrenadorId = req.user.id; // Id del entrenador para ver sus colaboraciones

        // Llamar al servicio para obtener los planes
        const planes = await planesService.mostrarPlanes(entrenadorId);

        res.status(200).json(planes);
    } catch (error) {
        console.error('Error en el controlador de mostrarPlanes:', error);
        if (error.message === 'Error al mostrar los planes de membresía') {
            return res.status(500).json({ error: 'Error al mostrar los planes de membresía' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

//Controlador para editar planes de membresía
const editarPlanes = async (req, res) => {
    try {
        const { nombre, descripcion, costo, duracion_meses, duracion_semanas, duracion_dias } = req.body;
        const { planId, gymId } = req.params; // Obtenemos los _id del plan y del gimnasio desde la URL
        const adminGymIds = req.user.gym_id; // Array de gym_id del administrador

        // Validar que el gymId esté en el array de gym_id del administrador
        if (!adminGymIds.includes(gymId)) {
            return res.status(403).json({ error: 'No tienes permisos para editar planes en este gimnasio' });
        }

        // Validaciones para costo y duraciones
        if (costo !== undefined && costo < 0) {
            return res.status(400).json({ error: 'El costo no puede ser negativo.' });
        }

        if (duracion_meses !== undefined && duracion_meses < 0) {
            return res.status(400).json({ error: 'La duración en meses no puede ser negativa.' });
        }

        if (duracion_semanas !== undefined && duracion_semanas < 0) {
            return res.status(400).json({ error: 'La duración en semanas no puede ser negativa.' });
        }

        if (duracion_dias !== undefined && duracion_dias < 0) {
            return res.status(400).json({ error: 'La duración en días no puede ser negativa.' });
        }

        // Construir los objetos updateFields y unsetFields
        const updateFields = {};
        const unsetFields = {};

        if (nombre) updateFields.nombre = nombre;
        if (descripcion) updateFields.descripcion = descripcion;
        if (costo) updateFields.costo = costo;

        // Manejar duraciones
        if (duracion_meses !== undefined) {
            if (duracion_meses === 0) {
                unsetFields.duracion_meses = ""; // Eliminar el campo
            } else {
                updateFields.duracion_meses = duracion_meses;
            }
        }

        if (duracion_semanas !== undefined) {
            if (duracion_semanas === 0) {
                unsetFields.duracion_semanas = ""; // Eliminar el campo
            } else {
                updateFields.duracion_semanas = duracion_semanas;
            }
        }

        if (duracion_dias !== undefined) {
            if (duracion_dias === 0) {
                unsetFields.duracion_dias = ""; // Eliminar el campo
            } else {
                updateFields.duracion_dias = duracion_dias;
            }
        }

        // Validar que haya algo que actualizar o eliminar
        if (Object.keys(updateFields).length === 0 && Object.keys(unsetFields).length === 0) {
            return res.status(400).json({ error: 'No se han proporcionado datos para actualizar o eliminar.' });
        }

        // Llamar al servicio para editar el plan
        const planActualizado = await planesService.editarPlanes(planId, gymId, updateFields, unsetFields);

        res.status(200).json(planActualizado);
    } catch (error) {
        console.error('Error en el controlador de editarPlanes:', error);
        if (error.message === 'Plan no encontrado o no pertenece al gimnasio') {
            return res.status(404).json({ error: 'Plan no encontrado o no pertenece al gimnasio' });
        }
        res.status(500).json({ error: 'Error al actualizar el plan de membresía' });
    }
};

// Controlador para "eliminar" un plan de membresía
const eliminarPlan = async (req, res) => {
    try {
        const { planId, gymId } = req.params; // Obtenemos los _id del plan y del gimnasio desde la URL
        const adminGymIds = req.user.gym_id; // Array de gym_id del administrador

        // Validar que el gymId esté en el array de gym_id del administrador
        if (!adminGymIds.includes(gymId)) {
            return res.status(403).json({ error: 'No tienes permisos para editar planes en este gimnasio' });
        }

        const eliminado = await planesService.eliminarPlan(planId, gymId);
        if (!eliminado) {
            return res.status(404).json({ error: 'Plan de membresía no encontrado' });
        } else{
            return res.status(200).json({ message: 'Plan de membresía eliminado correctamente' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el plan de membresía' });
    }
};

module.exports = { crearPlanes, mostrarPlanes, editarPlanes, eliminarPlan };