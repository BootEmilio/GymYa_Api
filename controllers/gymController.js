const gymService = require('../services/gymService')

//Controlador para agregar gimnasios
const crearGimnasio = async (req, res) => {
    try{
        const { nombre, direccion, telefono, fechaRegistro } = req.body;
        const nuevoGimnasio = await gymService.crearGimnasio(nombre, direccion, telefono, fechaRegistro);
        res.status(201).json(nuevoGimnasio);
    }catch (error) {
        res.status(500).json({error: 'Error al crear nuevo gimnasio'});
    }
}

//Controlador para editar gimnasios
const editarGimnasio = async (req, res) => {
    try{
        const { nombre, direccion, telefono } = req.body;

        // Verificamos que el gimnasio a editar es el del administrador autenticado
        const gymId = req.user.gym_id; 
        if (gymId !== parseInt(req.params.id)) {
            return res.status(403).json({ error: 'No tienes permiso para editar este gimnasio' });
        }

        const actualizado = await gymService.editarGimnasio(req.params.id, nombre, direccion, telefono);
        if(!actualizado){
            return res.status(404).json({error: 'Gimnasio no encontrado'});
        }
        res.status(200).json(actualizado);
    }catch (error) {
        res.status(500).json({error: 'Error al actualizar el gimnasio'});
    }
}

module.exports = { crearGimnasio, editarGimnasio };