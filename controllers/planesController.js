const planesService = require('../services/planesService')

//Controlador para agregar planes de membrbesía
const crearPlanes = async (req, res) => {
    try{
        const { nombre, descripcion, costo, duracion_meses, duracion_semanas, duracion_dias, gymIds = [] } = req.body;
        const adminGymIds = req.user.gym_id; // Array de gym_id del administrador
        const gymIdURL = req.params.gymId;

        // Agregar el gymId de la URL al array de gymIds si no está ya presente
        if (!gymIds.includes(gymIdURL)) {
            gymIds.push(gymIdURL);
        }

        // Validar que se proporcionen gymIds
        if (gymIds.length === 0) {
            return res.status(400).json({ error: 'Debe proporcionar al menos un gimnasio válido.' });
        }

        // Verificar que todos los gymIds proporcionados estén en el array de gym_id del administrador
        const gymIdsInvalidos = gymIds.filter(gymId => !adminGymIds.includes(gymId));
        if (gymIdsInvalidos.length > 0) {
            return res.status(403).json({ error: 'No tienes permisos para agregar planes en algunos de los gimnasios seleccionados.' });
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

        const nuevoPlan = await planesService.crearPlanes(gymIds, nombre, descripcion, costo, duracion_meses, duracion_semanas, duracion_dias);
        res.status(201).json(nuevoPlan);
    }catch (error) {
        res.status(500).json({error: 'Error al crear nuevo plan de membresía'});
    }
};

//Controlador para mostrar planes de membresía
const mostrarPlanes = async (req, res) => {
    try {
        const { gymId } = req.params; // Obtener el gymId desde los parámetros de la ruta
        const adminGymIds = req.user.gym_id; // Array de gym_id del administrador

        // Validar que el gymId esté en el array de gym_id del administrador
        if (!adminGymIds.includes(gymId)) {
            return res.status(403).json({ error: 'No tienes permisos para ver los planes de este gimnasio' });
        }

        // Llamar al servicio para obtener los planes
        const planes = await planesService.mostrarPlanes(gymId);

        res.status(200).json(planes);
    } catch (error) {
        console.error('Error en el controlador de mostrarPlanes:', error);
        if (error.message === 'Error al mostrar los planes de membresía') {
            return res.status(500).json({ error: 'Error al mostrar los planes de membresía' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Controlador para que un usuario vea los planes de membresía disponibles
const mostrarPlanesUser = async (req, res) => {
    try {
        const { membresiaId } = req.params; // Obtener el _id de la URL

        // Validar que el membresiaId exista en la URL
        if (!membresiaId) {
            return res.status(400).json({ error: 'Falta el ID de la membresía en los parámetros' });
        }

        // Llamar al servicio para obtener los planes de membresía
        const planes = await planesService.mostrarPlanesUser(membresiaId);

        if (!planes || planes.length === 0) {
            return res.status(404).json({ error: 'No se encontraron planes de membresía disponibles' });
        }

        // Enviar los planes obtenidos
        res.status(200).json(planes);
    } catch (error) {
        console.error('Error al mostrar planes de membresía:', error);
        res.status(500).json({ error: 'Error interno al mostrar planes de membresía' });
    }
};

// Controlador para mostrar un solo plan de membresía
const mostrarPlanIndividual = async (req, res) => {
    try {
        const { planId } = req.params; // Extraer el planId desde los parámetros de la URL

        // Llamar a la función que obtiene el plan de membresía individual
        const plan = await planesService.mostrarPlanIndividual(planId);

        // Verificar si ocurrió un error (como que no exista el plan)
        if (plan.error) {
            return res.status(404).json({ error: plan.error });
        }

        // Devolver el plan encontrado
        return res.status(200).json(plan);
    } catch (error) {
        console.error('Error en el controlador al obtener el plan de membresía:', error);
        return res.status(500).json({ error: 'Error al obtener el plan de membresía' });
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

        // Si no se encontró el plan
        if (!eliminado) {
            return res.status(404).json({ error: 'Plan de membresía no encontrado o ya eliminado' });
        }

        // Devolver el plan desactivado
        return res.status(200).json({ message: 'Plan de membresía eliminado correctamente', plan: eliminado });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el plan de membresía' });
    }
};

module.exports = { crearPlanes, mostrarPlanes, mostrarPlanesUser, mostrarPlanIndividual, editarPlanes, eliminarPlan };