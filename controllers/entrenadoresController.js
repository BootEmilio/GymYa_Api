const entrenadoresService = require('../services/entrenadoresService');
const Entrenador = require('../models/entrenador');

//Controlador para que un administrador agregue a un entrenador
const agregarEntrenador = async(req, res) => {
    try{
        const {nombre_completo, especialidad, horario, imagen } = req.body;
        const gym_id = req.user.gym_id; //Obtenemos el gym_id del token del administrador

        //Validar que todos los datos son proporcionados
        if(!nombre_completo || !especialidad || !horario){
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const nuevoEntrenador = await entrenadoresService.agregarEntrenador(gym_id, nombre_completo, especialidad, horario, imagen);
        res.status(201).json(nuevoEntrenador);
    }catch (error){
        res.status(500).json({error: 'Error al agregar al entrenador'});
    }
};

//Registro de entrenador independiente
const registro = async(req,res) => {
    try{
        const {nombre_completo, especialidad, telefono, email, imagen} = req.body;

        if(!nombre_completo || !especialidad || !telefono || !email){
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Verificar si el teléfono ya existe
        const telefonoExistente = await Entrenador.findOne({ telefono });
        if (telefonoExistente) {
            return res.status(400).json({ error: 'El teléfono ya está registrado' });
        }

        // Verificar si el email ya existe
        const emailExistente = await Entrenador.findOne({ email });
        if (emailExistente) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const nuevoEntrenador = await entrenadoresService.registro(nombre_completo, especialidad, telefono, email, imagen);
        res.status(201).json(nuevoEntrenador);
    }catch(error){
        res.status(500).json({error: 'Error al agregar al entrenador'});
    }
};

module.exports = { agregarEntrenador, registro };