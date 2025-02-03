const mongoose = require('mongoose')
const Membresia = require('../models/membresias');
const Usuario = require('../models/usuarios');
const Plan = require('../models/planes');
require('dotenv').config();

//Servicio para obtener las membresías activas o inactivas de un gimnasio
const getMembresias = async (gymId, status) => {
    try{
        // Verificar si gymId es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(gymId)) {
            throw new Error('El gymId proporcionado no es válido');
        }

        let dateCondition;
        if (status === 'activas') {
            dateCondition = { $gt: new Date() }; // Membresías activas
        } else if (status === 'expiradas') {
            dateCondition = { $lt: new Date() }; // Membresías expiradas
        } else {
            throw new Error('El estado proporcionado no es válido. Use "activas" o "expiradas".');
        }

        // Agregación en MongoDB con la condición dinámica
        const membresias = await Membresia.aggregate([
            {
                $match: {
                    fecha_fin: dateCondition, // Condición dinámica según el estado
                    gym_id: new mongoose.Types.ObjectId(gymId) // Asegurar que gymId es un ObjectId
                }
            },
            {
                $lookup: {
                    from: 'usuarios', // Colección usuarios
                    localField: 'usuario_id', // Campo en membresias
                    foreignField: '_id', // Campo en usuarios
                    as: 'usuario'
                }
            },
            { $unwind: '$usuario' }, // Descomprimir el array de usuarios
            {
                $lookup: {
                    from: 'planes', // Colección planes
                    localField: 'plan_id', // Campo en membresias
                    foreignField: '_id', // Campo en planes
                    as: 'plan'
                }
            },
            { $unwind: '$plan' }, // Descomprimir el array de plane
            {
                $project: {
                    membresia_id: '$_id', // Seleccionamos los campos deseados
                    fecha_inicio: 1,
                    fecha_fin: 1,
                    usuario_id: '$usuario._id',
                    nombre_completo: '$usuario.nombre_completo',
                    username: '$usuario.username',
                    nombre_plan: '$plan.nombre',
                    _id: 0
                }
            }
        ]);

        // Verificar si no se encontraron membresías
        if (membresias.length === 0) {
            return `No se encontraron membresías ${status} para el gimnasio con id: ${gymId}`;
        }
        return membresias;
    }catch (error){
        console.error(`Error al mostrar las membresías ${status} para gymId: ${gymId}:`, error);
        throw new Error(`Error al mostrar las membresías ${status}`);
    }
};

//Servicio para aplazar fecha_fin

module.exports = { getMembresias };