const entrenadoresService = require('../services/entrenadoresService');

//Controlador para que un administrador agregue a un entrenador
const agregarEntrenador = async(req, res) => {
    try{
        const {nombre_completo, especialidad, horario, imagen } = req.body;
        const {gym_id} = req.user.gym_id; //Obtenemos el gym_id del token del administrador

        //Validar que todos los datos son proporcionados
        if(!gym_id || !nombre_completo || !especialidad || !horario){
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const nuevoEntrenador = await entrenadoresService.agregarEntrenador(gym_id, nombre_completo, especialidad, horario, imagen);
        res.status(201).json(nuevoEntrenador);
    }catch (error){
        res.status(500).json({error: 'Error al agregar al entrenador'});
    }
};

module.exports = { agregarEntrenador };