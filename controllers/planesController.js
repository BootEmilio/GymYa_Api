const planesService = require('../services/planesService')

//Controlador para agregar planes de membrbesía
const crearPlanes = async (req, res) => {
    try{
        const { nombre, descripcion, costo, duracion_meses, duracion_semanas, duracion_dias } = req.body;
        const gym_id = req.user.gym_id; //Usamos el gym_id del token

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
        if (costo !== undefined && costo<0) {
            return res.status(400).json({ error: 'El costo no puede ser negativo.' });
        }

        const nuevoPlan = await planesService.crearPlanes(gym_id, nombre, descripcion, costo, duracion_meses, duracion_semanas, duracion_dias);
        res.status(201).json(nuevoPlan);
    }catch (error) {
        res.status(500).json({error: 'Error al crear nuevo plan de membresía'});
    }
};

//Controlador para mostrar planes de membresía
const mostrarPlanes = async (req, res) => {
    try {
        const gym_id = req.user.gym_id; //Usamos el gum_id del token
        const planes = await planesService.mostrarPlanes(gym_id);
        res.status(200).json(planes);
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar los planes de membresía' });
    }
};

//Controlador para editar planes de membresía
const editarPlanes = async (req, res) => {
    try{
        const { nombre, descripcion, costo, duracion_meses, duracion_semanas, duracion_dias } = req.body;
        const id = req.params.id; // Obtenemos el _id del plan por medio de la URL
        const gym_id = req.user.gym_id; //Usamos el gym_id del token

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

        const actualizado = await planesService.editarPlanes(id, gym_id, nombre, descripcion, costo, duracion_meses, duracion_semanas, duracion_dias);
        if(!actualizado){
            return res.status(404).json({error: 'Plan de membresía no encontrado'});
        }
        res.status(200).json(actualizado);
    }catch (error) {
        res.status(500).json({error: 'Error al actualizar el plan de membresía'});
    }
}

// Controlador para "eliminar" un plan de membresía
const eliminarPlan = async (req, res) => {
    try {
        const gym_id = req.user.gym_id; //Usamos el gym_id del token
        const eliminado = await planesService.eliminarPlan(req.params.id, gym_id); // Obtenemos el _id del plan

        if (!eliminado) {
            return res.status(404).json({ error: 'Plan de membresía no encontrado' });
        }

        res.status(200).json({ message: 'Plan de membresía eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el plan de membresía' });
    }
};

module.exports = { crearPlanes, mostrarPlanes, editarPlanes, eliminarPlan };