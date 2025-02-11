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
    res.status(500).json({error: 'Error al registrar el usuario junto a su membresía'});
  }
};

//Controlador para ver membresias activas y expiradas
const getMembresias = async (req, res) => {
  try {
      const gym_id = req.user.gym_id; // Usamos el gym_id del token
      const { status } = req.params; // Usamos el status de la URL
      const { page = 1, limit = 10, search } = req.query; // Parámetros de paginación y búsqueda

      // Validar si el status es "activas" o "expiradas"
      if (status !== 'activas' && status !== 'expiradas') {
          return res.status(400).json({ error: 'Estado inválido. Use "activas" o "expiradas".' });
      }

      // Llamar al servicio para obtener las membresías
      const { membresias, total } = await membresiasService.getMembresias(gym_id, status, page, limit, search);

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

//Controlador para ver membresias activas y expiradas
const getMembresia = async (req, res) => {
  try {
    const { id: usuario_id } = req.user || {}; //Obtenemos el _id del token del usuario
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

module.exports = { registroUsuario, getMembresias,  getMembresia, aplazarMembresia };