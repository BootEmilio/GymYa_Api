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
        const {nombre_completo, especialidad, telefono, email, password, imagen} = req.body;

        if(!nombre_completo || !especialidad || !telefono || !email || !password){
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

        const nuevoEntrenador = await entrenadoresService.registro(nombre_completo, especialidad, telefono, email, password, imagen);
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

module.exports = { agregarEntrenador, registro, login };