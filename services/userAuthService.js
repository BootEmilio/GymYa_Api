const user = require('../models/usuarios');
const membresia = require('../models/membresias');
const plan = require('../models/planes');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;
const tokenExpiration = process.env.JWT_EXPIRATION || '2h';

//Servicio para crear un nuevo usuario con su membresia
const registroUsuario = async(gym_id, plan_id, username, password, nombre_completo, email, telefono) => {
    try{
        //Crear el usuario
        const nuevoUsuario = await user.create({
            gym_id,
            username,
            password,
            nombre_completo,
            email,
            telefono
        });
        const usuario_id = nuevoUsuario._id;

        //Obtenemos el plan de membresía que se ha escogido
        const planSeleccionado = await plan.findById(plan_id);
        if(!planSeleccionado){
          throw new Error('El plan seleccionado no existe');
        }

        //Obtenemos la fecha de hoy
        const fecha_inicio = new Date();
        //Calculamos la fecha en la que termina la membresía
        const meses = planSeleccionado.duracion_meses;
        const fecha_fin = new Date(fecha_inicio);
        fecha_fin.setMonth(fecha_fin.getMonth() + meses);

        //Crear la nueva membresía
        const nuevaMembresia = await membresia.create({
          usuario_id,
          gym_id,
          plan_id,
          fecha_inicio,
          fecha_fin
        });

        return { success: true, message: 'Registro de usuario exitoso', usuario: nuevoUsuario, membresia: nuevaMembresia };
    } catch(error){
      console.error('Erros al registrar al usuario:', error);
      throw new Error('Error al registrar al usuario');
    }
};

// Servicio para hacer login como usuario
const authenticateUser = async (username, password) => {
  try {
    // Buscar el usuario por username
    const usuario = await user.findOne({ username });

    // Verificar si el usuario existe y la contraseña es correcta
    if (!usuario || usuario.password !== password) {
      return null; // Retornar null si no coincide el username o la contraseña
    }

    const token = jwt.sign(
      {
        id: usuario._id,
        username: usuario.username,
        role: 'user',
        gym_id: usuario.gym_id
      },
      secretKey,
      { expiresIn: tokenExpiration }
    );

    return { token, usuario };  
  } catch (error) {
    console.error('Error autenticando al usuario:', error);
    throw new Error('Error al autenticar');
  }
};

module.exports = { registroUsuario, authenticateUser };