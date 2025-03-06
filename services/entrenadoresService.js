const Entrenador = require('../models/entrenador');
const Membresia = require('../models/membresias');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;
const tokenExpiration = process.env.JWT_EXPIRATION || '2h';

//Servicio para que un administrador agregue un entrenador a su gimnasio
const agregarEntrenador = async(gymId, nombre_completo, especialidad, horario, imagenUrl) => {
    try{
        //Crear al entrenador
        const nuevoEntrenador = await Entrenador.create({
            gym_id: gymId,
            nombre_completo: nombre_completo,
            especialidad: especialidad,
            horario: horario,
            imagen: imagenUrl
        });

        return { success: true, message: 'Se ha agregado correctamente un entrenador nuevo', entrenador: nuevoEntrenador };
    }catch(error){
        console.error('Error al agregar al entrenador:', error);
        throw new Error('Error al agregar al entrenador');
    }
};

//Servicio para que un administrador vea los entrenadores de su gimnasio
const verEntrenadores = async (gymId) => {
    try {
      // Buscar todos los entrenadores que tengan el gymId en su array gym_id
      const entrenadores = await Entrenador.find({ gym_id: gymId }).exec();
  
      // Si no se encuentran entrenadores, puedes devolver un array vacío o un mensaje
      if (!entrenadores || entrenadores.length === 0) {
        return []; // o puedes devolver un mensaje como { message: 'No hay entrenadores en este gimnasio' }
      }
  
      return entrenadores;
    } catch (error) {
      throw new Error('Error al buscar los entrenadores: ' + error.message);
    }
};

//Servicio para que un administrador vea los entrenadores de su gimnasio
const verEntrenador = async (entrenadorId) => {
    try {
      // Buscar todos los entrenadores que tengan el gymId en su array gym_id
      const entrenador = await Entrenador.findById(entrenadorId);
  
      return entrenador;
    } catch (error) {
      throw new Error('Error al buscar el entrenador: ' + error.message);
    }
};

//Servicio para ver los entrenadores disponibles con la membresia
const verEntrenadoresUser = async (membresiaId) => {
    try {
        // Buscar la membresía junto con su array de gym_id
        const membresia = await Membresia.findById(membresiaId).exec();
        
        if (!membresia) {
            return { message: "Membresía no encontrada" };
        }

        // Verificar si la membresía tiene gyms asociados
        if (!membresia.gym_id || membresia.gym_id.length === 0) {
            return { message: "Esta membresía no tiene gimnasios asociados" };
        }

        // Si el gym_id en Entrenador es un ObjectId, convertir los IDs de membresía
        const gymIds = membresia.gym_id.map(id => mongoose.Types.ObjectId(id)); // Convertir cada gym_id a ObjectId

        // Buscar entrenadores cuyos gym_id están en el array gym_id de la membresía
        const entrenadores = await Entrenador.find({ gym_id: { $in: gymIds } }).exec();
        
        // Si no se encuentran entrenadores
        if (!entrenadores || entrenadores.length === 0) {
            return { message: "No hay entrenadores disponibles con esta membresía" };
        }
        
        return entrenadores;
    } catch (error) {
        throw new Error('Error al buscar los entrenadores: ' + error.message);
    }
};

//Servicio para que un entrenador independiente se registre
const registro = async(nombre_completo, especialidad, email, password, imagen) => {
    try{
        //Agregamos una imagen por defecto del entrenador
        if(!imagen){
            imagen = 'user.jpg';
        }

        // Hash de la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoEntrenador = await Entrenador.create({
           nombre_completo,
           especialidad,
           independiente: true,
           email,
           password: hashedPassword,
           imagen
        });

        return { success: true, message: 'Se ha registrado con éxito a GymYa!', entrenador: nuevoEntrenador };
    }catch(error){
        onsole.error('Error al registrarse:', error);
        throw new Error('Error al registrarse');
    }
};

//Servicio para que un entrenador haga login
const login = async (entrenador) => {
    try {
        // Crear el token
        const token = jwt.sign(
            {
                id: entrenador._id,
                username: entrenador.username,
                role: 'entrenador',
            },
            secretKey,
            { expiresIn: tokenExpiration }
        );

        return { token, entrenador };
    } catch (error) {
        console.error('Error en el servicio de autenticación:', error);
        throw new Error('Error al autenticar');
    }
};

module.exports= { agregarEntrenador, verEntrenadores, verEntrenador, verEntrenadoresUser, registro, login };