const entrenadoresService = require('../services/entrenadoresService');
const Entrenador = require('../models/entrenador');
const Gym = require('../models/gym');
const Membresia = require('../models/membresias');
const cloudinary = require('../cloudinary-config');
const fs = require('fs'); // para manejar el borrado de archivos temporales
const bcrypt = require('bcryptjs');

//Controlador para que un administrador agregue a un entrenador
const agregarEntrenador = async(req, res) => {
    try{
        const {gymId} = req.params; //Obtenemos el gym_id de la ruta
        const {nombre_completo, especialidad, horario } = req.body;
        const adminGymIds = req.user.gym_id; // Array de gym_id del administrador
        
        // Buscar el gimnasio en la base de datos usando Mongoose
        const gimnasioActual = await Gym.findById(gymId);
        if (!gimnasioActual) {
          return res.status(404).json({ error: 'Gimnasio no encontrado' });
        }
        
        // Verificar si el gymId está en el array de gym_id del administrador
        if (!adminGymIds.includes(gymId)) {
          return res.status(403).json({ error: 'No tienes permisos para agregar entrenadores en este gimnasio' });
        }

        //Validar que todos los datos son proporcionados
        if(!nombre_completo || !especialidad || !horario){
            return res.status(400).json({ error: 'Llene todos los campos del entrenador' });
        }

        // Validar si hay un archivo de imagen en la petición
        if (!req.file) {
          return res.status(400).json({ error: 'Suba una imagen del entrenador' });
        }

        // Subir imagen a Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
        
        // Guardar la URL de la imagen
        const imagenUrl = result.secure_url;

        const nuevoEntrenador = await entrenadoresService.agregarEntrenador(gymId, nombre_completo, especialidad, horario, imagenUrl);
        res.status(201).json(nuevoEntrenador);
    }catch (error){
        res.status(500).json({error: 'Error al agregar al entrenador'});
    }
};

//Controlador para que un administrador vea los entrenadores de su gimnasio
const verEntrenadores = async(req,res) => {
  try{
    const {gymId} = req.params; //Obtenemos el gym_id de la ruta
    const adminGymIds = req.user.gym_id; // Array de gym_id del administrador
        
    // Buscar el gimnasio en la base de datos usando Mongoose
    const gimnasioActual = await Gym.findById(gymId);
    if (!gimnasioActual) {
      return res.status(404).json({ error: 'Gimnasio no encontrado' });
    }
        
    // Verificar si el gymId está en el array de gym_id del administrador
    if (!adminGymIds.includes(gymId)) {
      return res.status(403).json({ error: 'No tienes permisos para ver los entrenadores de este gimnasio' });
    }

    const entrenadores = await entrenadoresService.verEntrenadores(gymId);

    res.status(200).json(entrenadores);
  }catch (error){
    res.status(500).json({error: 'Error al mostrar los entrenadores'});
  }
};

//Controlador para ver un entrenador en web o app móvil
const verEntrenador = async(req, res) => {
  try{
    const {entrenadorId} = req.params; //Obtenemos el _id del entrenador

    // Buscar el entrenador 
    const entrenador = await Entrenador.findById(entrenadorId);
    if (!entrenador) {
      return res.status(404).json({ error: 'Entrenador no encontrado' });
    }

    const result = await entrenadoresService.verEntrenador(entrenadorId);

    res.status(200).json(result);
  }catch (error){
    res.status(500).json({error: 'Error al mostrar el entrenador'});
  }
};

//Controlador para ver los entrenadores disponibles con la membresia
const verEntrenadoresUser = async(req,res) => {
  try{
    const {membresiaId} = req.params; //Obtenemos el gym_id de la ruta
    const userMembresiaIds = req.user.membresia_id; // Array de gym_id del administrador
        
    // Buscar la membresía en la base de datos usando Mongoose
    const membresia = await Membresia.findById(membresiaId);
    if (!membresia) {
      return res.status(404).json({ error: 'Membresía no encontrada' });
    }
        
    // Verificar si el gymId está en el array de gym_id del administrador
    if (!userMembresiaIds.includes(membresiaId)) {
      return res.status(403).json({ error: 'No tienes permisos para ver los entrenadores disponibles' });
    }

    const entrenadores = await entrenadoresService.verEntrenadores(membresiaId);

    res.status(200).json(entrenadores);
  }catch (error){
    res.status(500).json({error: 'Error al mostrar los entrenadores'});
  }
};

//Registro de entrenador independiente
const registro = async(req,res) => {
    try{
        const {nombre_completo, especialidad, email, password, imagen} = req.body;

        if(!nombre_completo || !especialidad || !email || !password){
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Verificar si el email ya existe
        const emailExistente = await Entrenador.findOne({ email });
        if (emailExistente) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const nuevoEntrenador = await entrenadoresService.registro(nombre_completo, especialidad, email, password, imagen);
        res.status(201).json(nuevoEntrenador);
    }catch(error){
        res.status(500).json({error: 'Error al agregar al entrenador'});
    }
};

//Controlador para que un entrenador haga login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Validar que se pasen los datos
    if (!username || !password) {
      return res.status(400).json({ message: 'Username y contraseña son requeridos' });
    }

    // Buscar el administrador por username
    const entrenador = await Entrenador.findOne({ email });  
    if (!entrenador) {
      throw new Error('Administrador no encontrado');
    }    
     
    // Comparar la contraseña usando bcrypt
    const isPasswordValid = await bcrypt.compare(password, entrenador.password);
    if (!isPasswordValid) {
      throw new Error('Contraseña incorrecta');
    }

    const authResult = await entrenadoresService.login(entrenador);

    res.status(200).json({
      message: 'Login exitoso',
      token: authResult.token,
      entrenador: authResult.entrenador,
    });
  } catch (error) {
    console.error('Error en el proceso de login del entrenador:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { agregarEntrenador, verEntrenadores, verEntrenador, verEntrenadoresUser, registro, login };