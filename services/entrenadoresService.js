const mongoose = require('mongoose');
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
        console.error('Erros al agregar al entrenador:', error);
        throw new Error('Error al agregar al entrenador');
    }
};

module.exports= { agregarEntrenador };