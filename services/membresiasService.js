const mongoose = require('mongoose')
const Membresia = require('../models/membresias');
const user = require('../models/usuarios');
const plan = require('../models/planes');
require('dotenv').config();

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

        // Calculamos la fecha de finalización en función de la duración del plan
        const fecha_fin = new Date(fecha_inicio);


        // Sumar meses, semanas y días según lo definido en el plan
        if (planSeleccionado.duracion_meses) {
            fecha_fin.setMonth(fecha_fin.getMonth() + planSeleccionado.duracion_meses);
        }
        if (planSeleccionado.duracion_semanas) {
            fecha_fin.setDate(fecha_fin.getDate() + (planSeleccionado.duracion_semanas * 7)); // Sumar semanas
        }
        if (planSeleccionado.duracion_dias) {
            fecha_fin.setDate(fecha_fin.getDate() + planSeleccionado.duracion_dias); // Sumar días
        }

        //Crear la nueva membresía
        const nuevaMembresia = await Membresia.create({
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

//Servicio para obtener las membresías activas o inactivas de un gimnasio
const getMembresias = async (gymId, status, page = 1, limit = 10, search = '') => {
    try {
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

        // Crear condición de búsqueda
        let searchCondition = {};
        if (search) {
            const searchConditions = [
                { 'usuario.nombre_completo': { $regex: search, $options: 'i' } },
                { 'usuario.username': { $regex: search, $options: 'i' } }
            ];

            // Solo agregar la búsqueda por _id si search es un ObjectId válido
            if (mongoose.Types.ObjectId.isValid(search)) {
                searchConditions.push({ '_id': new mongoose.Types.ObjectId(search) });
            }

            searchCondition = { $or: searchConditions };
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
            { $unwind: '$plan' }, // Descomprimir el array de planes
            {
                $match: searchCondition // Aplicar la condición de búsqueda
            },
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
            },
            {
                $facet: {
                    metadata: [{ $count: "total" }, { $addFields: { page: parseInt(page), limit: parseInt(limit) } }],
                    data: [{ $skip: (page - 1) * limit }, { $limit: parseInt(limit) }] // Paginación
                }
            }
        ]);

        // Verificar si no se encontraron membresías
        if (membresias[0].data.length === 0) {
            return { membresias: [], total: 0 };
        }

        const total = membresias[0].metadata[0].total;
        return { membresias: membresias[0].data, total };
    } catch (error) {
        console.error(`Error al mostrar las membresías ${status} para gymId: ${gymId}:`, error);
        throw new Error(`Error al mostrar las membresías ${status}`);
    }
};

//Servicio para mostrar la membresía del usuario
const getMembresia = async (usuario_id) =>{
    try{
        const resultado = await Membresia.aggregate([
            { $match: { usuario_id: new mongoose.Types.ObjectId(usuario_id) } },
            {
                $lookup: {
                    from: 'usuarios', // Colección usuarios
                    localField: 'usuario_id', // Campo en membresias
                    foreignField: '_id', // Campo en usuarios
                    as: 'usuario'
                }
            },
            { $unwind: '$usuario' },
            {
                $lookup: {
                    from: 'planes', // Colección planes
                    localField: 'plan_id', // Campo en membresias
                    foreignField: '_id', // Campo en planes
                    as: 'plan'
                }
            },
            { $unwind: '$plan' }, // Descomprimir el array de planes
            {
                $project: {
                    membresia_id: '$_id', // Seleccionamos los campos deseados
                    fecha_inicio: 1,
                    fecha_fin: 1,
                    usuario_id: '$usuario._id',
                    nombre_completo: '$usuario.nombre_completo',
                    username: '$usuario.username',
                    plan_id: '$plan._id',
                    nombre_plan: '$plan.nombre',
                    _id: 0
                }
            }
        ]);

        // Verificar si no se encontraron membresías
        if (resultado.length === 0) {
            return { error: 'No se ha encontrado ninguna membresía con ese usuario_id' };
        }

        return resultado;
    }catch(error){
        throw new Error('Error al obtener la membresía del usuario');
    }
};

//Servicio para aplazar fecha_fin
const aplazarMembresia = async(membresia_id, plan_id) => {
    try{
        //Buscamos la membresia por su _id
        const membresia = await Membresia.findById(membresia_id);
        if(!membresia){
            throw new Error('La membresía no existe');
        }

        //Obtener el plan seleccionado
        const planSeleccionado = await plan.findById(plan_id);
        if(!planSeleccionado){
            throw new Error('El plan seleccionado no existe');
        }

        //Obtenemos las fechas
        const fecha_fin_original = membresia.fecha_fin; //La fecha fin original
        const fecha_actual = new Date(); //fecha actual
        let nueva_fecha_fin; 

        // Si la fecha_fin original es mayor a la fecha actual, sumar a la fecha_fin original
        if (fecha_fin_original > fecha_actual) {
            nueva_fecha_fin = new Date(fecha_fin_original);
        } else {
            // Si la fecha_fin original ya pasó, sumar a la fecha actual
            nueva_fecha_fin = new Date(fecha_actual);
        }

        // Sumar meses, semanas y días según lo definido en el plan
        if (planSeleccionado.duracion_meses) {
            nueva_fecha_fin.setMonth(nueva_fecha_fin.getMonth() + planSeleccionado.duracion_meses);
        }
        if (planSeleccionado.duracion_semanas) {
            nueva_fecha_fin.setDate(nueva_fecha_fin.getDate() + (planSeleccionado.duracion_semanas * 7)); // Sumar semanas
        }
        if (planSeleccionado.duracion_dias) {
            nueva_fecha_fin.setDate(nueva_fecha_fin.getDate() + planSeleccionado.duracion_dias); // Sumar días
        }

        //Condición para el cambio de plan_id
        if (plan_id !== membresia.plan_id.toString()) {
            //Si la fecha_fin original es mayor a la fecha actual, no cambiar el plan_id hasta que la fecha original haya pasado
            if (fecha_fin_original <= fecha_actual) {
                membresia.plan_id = plan_id; // Cambiar el plan_id si ya pasó la fecha_fin original
            }
        }

        //Actualizar la membresía con la nueva fecha_fin y posiblemente nuevo plan_id
        membresia.fecha_fin = nueva_fecha_fin;
        await membresia.save();

        return membresia; // Retornar la membresía actualizada
    }catch (error){
        console.error('Error al aplazar la membresía:', error);
        throw new Error('Error al aplazar la membresía');
    }
};

module.exports = { registroUsuario, getMembresias, getMembresia, aplazarMembresia };