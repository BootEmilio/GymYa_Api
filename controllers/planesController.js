const planesService = require('../services/planesService')

//Controlador para agregar planes de membrbesía
const crearPlanes = async (req, res) => {
    try{
        const { gym_id, nombre, descripcion, costo, duracion, fecha_creacion } = req.body;
        const nuevoPlan = await planesService.crearPlanes(gym_id, nombre, descripcion, costo, duracion, fecha_creacion);
        res.status(201).json(nuevoPlan);
    }catch (error) {
        res.status(500).json({error: 'Error al crear nuevo plan de membresía'});
    }
}

//Controlador para mostrar planes de membresía
const mostrarPlanes = async (req, res) => {
    try {
        const costoMaximo = req.query.costoMaximo;  // Obtenemos el parámetro opcional de query
        const planes = await planesService.mostrarPlanes(costoMaximo);
        res.status(200).json(planes);
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar los planes de membresía' });
    }
};

//Controlador para editar planes de membresía
const editarPlanes = async (req, res) => {
    try{
        const { nombre, descripcion, costo, duracion } = req.body;
        const actualizado = await gymService.editarPlanes(req.params.id, nombre, descripcion, costo, duracion);
        if(!actualizado){
            return res.status(404).json({error: 'Plan de membresía no encontrado'});
        }
        res.status(200).json(actualizado);
    }catch (error) {
        res.status(500).json({error: 'Error al actualizar el plan de membresía'});
    }
}

module.exports = { crearPlanes, mostrarPlanes, editarPlanes };