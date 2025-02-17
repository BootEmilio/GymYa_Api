const Entrenador = require('../models/entrenador');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;
const tokenExpiration = process.env.JWT_EXPIRATION || '2h';

//Servicio para que un administrador agregue un entrenador a su gimnasio
const agregarEntrenador = async(gym_id, nombre_completo, especialidad, horario, imagen) => {
    try{
        //Agregamos una imagen por defecto del entrenador
        if(!imagen){
            imagen = 'user.jpg';
        }
        //Crear al entrenador
        const nuevoEntrenador = await Entrenador.create({
            gym_id,
            nombre_completo,
            especialidad,
            horario,
            imagen
        });

        return { success: true, message: 'Se ha agregado correctamente un entrenador nuevo', entrenador: nuevoEntrenador };
    }catch(error){
        console.error('Error al agregar al entrenador:', error);
        throw new Error('Error al agregar al entrenador');
    }
};

//Servicio para que un entrenador independiente se registre
const registro = async(nombre_completo, especialidad, telefono, email, password, imagen) => {
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
           telefono,
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

module.exports= { agregarEntrenador, registro, login };