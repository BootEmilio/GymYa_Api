const membresiasService = require('../services/membresiasService');
const User = require('../models/usuarios');

//Controlador para registrar usuarios con sus membresias
const registroUsuario = async (req, res) => {
  try{
    const {plan_id, nombre_completo, email, password, telefono, imagen} = req.body;

    // Validar que todos los campos estén presentes
    if (!plan_id || !nombre_completo || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Verificar si el email ya existe
    const emailExistente = await User.findOne({ email });
    if (emailExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const usuarioNuevo = await membresiasService.registroUsuario(plan_id, nombre_completo, email, password, telefono, imagen);
    res.status(201).json(usuarioNuevo);
  }catch (error) {
    res.status(500).json({error: 'Error al registrar el usuario junto a su membresía'});
  }
};

//Controlador para ver membresias activas y expiradas de un gimnasio
const getMembresias = async (req, res) => {
  try {
      const { gymId, status } = req.params; // Usamos el gymId y el status de la URL
      const { page = 1, limit = 10, search } = req.query; // Parámetros de paginación y búsqueda

      const adminGymIds = req.user.gym_id; // Array de gym_id del administrador

      // Verificar si el gymId está en el array de gym_id del administrador
      if (!adminGymIds.includes(gymId)) {
        return res.status(403).json({ error: 'No tienes permisos para editar este gimnasio' });
      }

      // Validar si el status es "activas" o "expiradas"
      if (status !== 'activas' && status !== 'expiradas') {
          return res.status(400).json({ error: 'Estado inválido. Use "activas" o "expiradas".' });
      }

      // Llamar al servicio para obtener las membresías
      const { membresias, total } = await membresiasService.getMembresias(gymId, status, page, limit, search);

      // Devolver los resultados como respuesta
      res.status(200).json({
          membresias,
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit)
      });
  } catch (error) {
      console.error('Error en obtener Membresias:', error);
      res.status(500).json({ error: 'Ocurrió un error al obtener las membresías.' });
  }
};

//Controlador para ver membresias activas y expiradas del usuario
const getMembresiasUser = async (req, res) => {
  try {
    const {membresiaId} = req.params; //Obtenemos el id de la membresía por medio de la URL
    const userMembresiaIds = req.user.membresia_id; //El array de 
    if(!usuario_id){
        return res.status(400).json({ error: 'No se encontró el usuario en la solicitud.' });
    }
      // Llamar al servicio para obtener las membresía
      const membresia = await membresiasService.getMembresia(usuario_id);

      // Devolver los resultados como respuesta
      res.status(200).json(membresia);
  } catch (error) { 
      console.error('Error en obtener Membresia:', error);
      res.status(500).json({ error: 'Ocurrió un error al obtener la membresía.' });
  }
};

//controlador para aplazar las membresías existentes
const aplazarMembresia = async (req, res) => {
  try{
    const { membresia_id } = req.params; // Obtenemos el id de la membresía en el URL
    const { plan_id } = req.body; // Obtenemos el id del plan por medio del body

    // Llamar al servicio para obtener aplazar las membresias
    const membresia = await membresiasService.aplazarMembresia(membresia_id, plan_id);

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

module.exports = { registroUsuario, getMembresias,  getMembresiasUser, aplazarMembresia };