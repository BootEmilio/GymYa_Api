const Entrenador = require('../models/entrenador');

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
const registro = async(nombre_completo, especialidad, telefono, email, imagen) => {
    try{
        //Agregamos una imagen por defecto del entrenador
        if(!imagen){
            imagen = 'user.jpg';
        }

        const nuevoEntrenador = await Entrenador.create({
           nombre_completo,
           especialidad,
           independiente: true,
           telefono,
           email,
           imagen
        });

        return { success: true, message: 'Se ha registrado con éxito a  GymYa!', entrenador: nuevoEntrenador };
    }catch(error){
        onsole.error('Error al registrarse:', error);
        throw new Error('Error al registrarse');
    }
};
module.exports= { agregarEntrenador, registro };