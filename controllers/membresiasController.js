const gym = require('../models/gym');
const membresiasService = require('../services/membresiasService');

//Controlador para registrar usuarios con sus membresias
const registroUsuario = async (req, res) => {
  try{
    const {plan_id, username, password, nombre_completo, email, telefono} = req.body;
    const gym_id = req.user.gym_id; //Usamos el gym_id del token

    // Validar que todos los campos estén presentes
    if (!plan_id || !username || !password || !nombre_completo || !email || !telefono) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const usuarioNuevo = await membresiasService.registroUsuario(gym_id, plan_id, username, password, nombre_completo, email, telefono);
    res.status(201).json(usuarioNuevo);
  }catch (error) {
    res.status(500).json({error: 'Error al registrar el primer administrador'});
  }
};

//Controlador para ver membresias activas y expiradas
const getMembresias = async (req, res) => {
    try{
        const { gymId, status } = req.params;

        // Validar si el status es "activas" o "expiradas"
        if (status !== 'activas' && status !== 'expiradas') {
            return res.status(400).json({ error: 'Estado inválido. Use "activas" o "expiradas".' });
        }

        // Llamar al servicio para obtener las membresías
        const membresias = await membresiasService.getMembresias(gymId, status);

        // Devolver los resultados como respuesta
        res.status(200).json(membresias);
    } catch (error){
        console.error('Error en obtenerMembresias:', error);
        res.status(500).json({ error: 'Ocurrió un error al obtener las membresías.' });
    }
};

//controlador para aplazar las membresías existentes
const aplazarMembresia = async (req, res) => {
  try{
    const { membresia_id } = req.params;
    const { plan_id } = req.body;

    // Llamar al servicio para obtener aplazar las membresias
    const membresia = await membresiasService.aplazarMembresia(membresia_id, plan_id);

    if (!membresia) {
      return res.status(404).json({ error: 'Membresía no encontrada' });
    }

    // Devolver la membresía actualizada como respuesta, incluyendo la nueva fecha_fin
    res.status(200).json({
      message: 'Membresía actualizada correctamente',
      membresia: {
        _id: membresia._id,
        gym_id: membresia.gym_id,
        plan_id: membresia.plan_id,
        fecha_fin: membresia.fecha_fin, // Nueva fecha_fin
      }
    });
  }catch (error){
    res.status(500).json({ error: 'Ocurrió un error al aplazar la fecha fin de la membresía.' });
  }
}; 

module.exports = { registroUsuario, getMembresias, aplazarMembresia };