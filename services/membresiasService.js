const mongoose = require('mongoose');
const Membresia = require('../models/membresias');
const user = require('../models/usuarios');
const plan = require('../models/planes');
const Pago = require('../models/pagos');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Función para generar una contraseña aleatoria
const generarContrasenaAleatoria = () => {
    const longitud = 12; // Longitud de la contraseña
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let contrasena = '';
    for (let i = 0; i < longitud; i++) {
        contrasena += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return contrasena;
};

// Función para enviar la contraseña por correo
const enviarCorreoContrasena = async (email, contrasena) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // O el servicio de correo que estés utilizando
        auth: {
            user: 'leviolevos@gmail.com',
            pass: 'tel9298862'
        }
    });

    const mailOptions = {
        from: 'leviolevos@gmail.com',
        to: email,
        subject: 'Tu nueva contraseña',
        text: `Hola, \n\nTu nueva contraseña es: ${contrasena}\n\nPor favor cámbiala una vez que inicies sesión.`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw new Error('Error al enviar el correo');
    }
};

//Servicio para crear un nuevo usuario con su membresia
const registroUsuario = async(plan_id, nombre_completo, email) => {
    try{
        //Obtenemos la fecha de hoy
        const fecha_inicio = new Date();

        // Calculamos la fecha de finalización en función de la duración del plan
        const fecha_fin = new Date(fecha_inicio);

        const planSeleccionado = await plan.findById(plan_id);
        
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

        const gym_id = planSeleccionado.gym_id;
        
        //Crear la nueva membresía
        const nuevaMembresia = await Membresia.create({
            gym_id,
            plan_id,
            fecha_inicio,
            fecha_fin
        });

        //Obtenemos el _id de la nueva membresía
        const membresia_id = [nuevaMembresia._id];

        //Generamos la contraseña de manera aleatoria
        const password = generarContrasenaAleatoria();

        //Enviar contraseña por correo
        await enviarCorreoContrasena(email, password);

        //Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 12);

        //Agregamos nulo al telefono
        if(!telefono){
            telefono = null;
        }

        //Crear el usuario
        const nuevoUsuario = await user.create({
            membresia_id,
            nombre_completo,
            email,
            password: hashedPassword,
            telefono,
            imagen: 'https://api-gymya-api.onrender.com/uploads/default-user.png'
        });

        //Crear el pago
        const nuevoPago = await Pago.create({
            membresia_id: nuevaMembresia._id,
            gym_id: planSeleccionado.gym_id,
            fecha_hora: fecha_inicio,
            concepto: planSeleccionado.nombre,
            monto: planSeleccionado.costo
        });

        return { success: true, 
            message: 'Registro de usuario exitoso', 
            usuario: nuevoUsuario, 
            membresia: nuevaMembresia, 
            pago: nuevoPago 
        };
    } catch(error){
      console.error('Erros al registrar al usuario:', error);
      throw new Error('Error al registrar al usuario');
    }
};

//Servicio para crear una nueva membresía de un usuario que ya este registrado
const crearMembresia = async (plan_id, email) => {
    try{
        //Buscamos el plan de membresía
        const planSeleccionado = await plan.findById(plan_id);

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

        //Creamos la nueva membresia
        const nuevaMembresia = await Membresia.create({
            gym_id: planSeleccionado.gym_id,
            plan_id: planSeleccionado._id,
            fecha_inicio: fecha_inicio,
            fecha_fin: fecha_fin
        })

        //Actualizamos al usuario para agregar al array la nueva membresia
        const usuario = await user.findOneAndUpdate(
            { email }, // Buscar el usuario por email
            { $push: { membresia_id: nuevaMembresia._id } }, // Agregar la nueva membresía al array
            { new: true } // Retornar el usuario actualizado
        );

        //Crear el pago
        const nuevoPago = await Pago.create({
            membresia_id: nuevaMembresia._id,
            gym_id: planSeleccionado.gym_id,
            fecha_hora: fecha_inicio,
            concepto: planSeleccionado.nombre,
            monto: planSeleccionado.costo
        });

        return {
            success: true, 
            message: 'Nueva membresía creada',
            membresia: nuevaMembresia,
            usuario: usuario,
            pago: nuevoPago
        };
    }catch (error){
        console.error('Error al crear una nueva membresía:', error);
        throw new Error('Error al crear una nueva membresía');
    }
};

//Servicio para mosotrar las membresías activas o expiradas de un gimnasio
const getMembresias = async (gymId, status, page = 1, limit = 10, search = '') => {
    try {
        // Establecer la condición de fecha según el estado (activas o expiradas)
        let dateCondition;
        if (status === 'activas') {
            dateCondition = { $gt: new Date() }; // Membresías activas
        } else if (status === 'expiradas') {
            dateCondition = { $lt: new Date() }; // Membresías expiradas
        } else {
            throw new Error('El estado proporcionado no es válido. Use "activas" o "expiradas".');
        }

        // Crear la condición de búsqueda (para nombre o email del usuario)
        let searchCondition = {};
        if (search) {
            const searchConditions = [
                { 'nombre_completo': { $regex: search, $options: 'i' } },
                { 'email': { $regex: search, $options: 'i' } }
            ];

            // Solo agregar la búsqueda por _id si search es un ObjectId válido
            if (mongoose.Types.ObjectId.isValid(search)) {
                searchConditions.push({ '_id': new mongoose.Types.ObjectId(search) });
            }

            searchCondition = { $or: searchConditions };
        }

        // Agregación en MongoDB desde Usuario
        const membresias = await user.aggregate([
            {
                $match: searchCondition // Aplicar la condición de búsqueda si se proporcionó
            },
            {
                $lookup: {
                    from: 'membresias', // Colección membresias
                    localField: 'membresia_id', // Campo en usuarios
                    foreignField: '_id', // Campo en membresias
                    as: 'membresias'
                }
            },
            { $unwind: '$membresias' }, // Descomprimir el array de membresías
            {
                $lookup: {
                    from: 'planes', // Colección planes
                    localField: 'membresias.plan_id', // Campo en membresias
                    foreignField: '_id', // Campo en planes
                    as: 'plan'
                }
            },
            { $unwind: '$plan' }, // Descomprimir el array de planes
            {
                $match: {
                    'plan.gym_id': new mongoose.Types.ObjectId(gymId), // Filtrar por gym_id
                    'membresias.fecha_fin': dateCondition // Condición dinámica según el estado
                }
            },
            {
                $project: {
                    membresia_id: '$membresias._id', // Seleccionamos los campos deseados
                    fecha_inicio: '$membresias.fecha_inicio',
                    fecha_fin: '$membresias.fecha_fin',
                    usuario_id: '$_id',
                    nombre_completo: '$nombre_completo',
                    email: '$email',
                    imagen: '$imagen',
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
        throw new Error(`Error al mostrar las membresías ${status}: ${error.message}`);
    }
};

const getMembresiasCount = async (gymId, status) => {
    try {
        // Establecer la condición de fecha según el estado (activas o expiradas)
        let dateCondition;
        if (status === 'activas') {
            dateCondition = { $gt: new Date() }; // Membresías activas
        } else if (status === 'expiradas') {
            dateCondition = { $lt: new Date() }; // Membresías expiradas
        } else {
            throw new Error('El estado proporcionado no es válido. Use "activas" o "expiradas".');
        }

        // Agregación en MongoDB desde Usuario
        const countResult = await user.aggregate([
            {
                $lookup: {
                    from: 'membresias', // Colección membresias
                    localField: 'membresia_id', // Campo en usuarios
                    foreignField: '_id', // Campo en membresias
                    as: 'membresias'
                }
            },
            { $unwind: '$membresias' }, // Descomprimir el array de membresías
            {
                $lookup: {
                    from: 'planes', // Colección planes
                    localField: 'membresias.plan_id', // Campo en membresias
                    foreignField: '_id', // Campo en planes
                    as: 'plan'
                }
            },
            { $unwind: '$plan' }, // Descomprimir el array de planes
            {
                $match: {
                    'plan.gym_id': new mongoose.Types.ObjectId(gymId), // Filtrar por gym_id
                    'membresias.fecha_fin': dateCondition // Condición dinámica según el estado
                }
            },
            {
                $count: 'total' // Contar los resultados
            }
        ]);

        // Si no hay resultados, devolver un total de 0
        const total = countResult.length > 0 ? countResult[0].total : 0;

        return { total };

    } catch (error) {
        console.error(`Error al contar las membresías ${status} para gymId: ${gymId}:`, error);
        throw new Error(`Error al contar las membresías ${status}: ${error.message}`);
    }
};

const getTotalMembresias = async (gymId) => {
    try {
        const totalResult = await user.aggregate([
            {
                $lookup: {
                    from: 'membresias', // Colección membresías
                    localField: 'membresia_id', // Campo en usuarios
                    foreignField: '_id', // Campo en membresías
                    as: 'membresias'
                }
            },
            { $unwind: '$membresias' }, // Descomprimir el array de membresías
            {
                $lookup: {
                    from: 'planes', // Colección planes
                    localField: 'membresias.plan_id', // Campo en membresías
                    foreignField: '_id', // Campo en planes
                    as: 'plan'
                }
            },
            { $unwind: '$plan' }, // Descomprimir el array de planes
            {
                $match: {
                    'plan.gym_id': new mongoose.Types.ObjectId(gymId) // Filtrar por gym_id
                }
            },
            {
                $count: 'total' // Contar los resultados
            }
        ]);

        // Si no hay resultados, devolver un total de 0
        const total = totalResult.length > 0 ? totalResult[0].total : 0;

        return { total };
    } catch (error) {
        console.error(`Error al contar las membresías para gymId: ${gymId}`, error);
        throw new Error(`Error al contar las membresías: ${error.message}`);
    }
};



//Servicio para mostrar las membresías del usuario
const getMembresiasUser = async (usuario_id) => {
    try {
        // Obtener el usuario por su ID para extraer su array de membresias_id
        const usuario = await user.findById(usuario_id).populate('membresia_id');

        // Obtener las membresías relacionadas con el usuario
        const membresias_ids = usuario.membresia_id.map(m => m._id);

        // Realizamos la agregación
        const resultado = await Membresia.aggregate([
            { $match: { _id: { $in: membresias_ids } } }, // Buscar todas las membresías en el array del usuario
            {
                $lookup: {
                    from: 'planes', // Colección planes
                    localField: 'plan_id', // Campo en membresías
                    foreignField: '_id', // Campo en planes
                    as: 'plan'
                }
            },
            { $unwind: '$plan' }, // Descomprimir el array de planes
            {
                $lookup: {
                    from: 'gimnasios', // Colección gimnasios
                    localField: 'gym_id', // Campo en membresías
                    foreignField: '_id', // Campo en gimnasios
                    as: 'gimnasios' // Array de gimnasios
                }
            },
            {
                $project: {
                    membresia_id: '$_id', // Seleccionar los campos deseados
                    fecha_inicio: 1,
                    fecha_fin: 1,
                    plan_id: '$plan._id',
                    nombre_plan: '$plan.nombre',
                    gimnasios: '$gimnasios.nombre', // Obtener solo los nombres de los gimnasios
                    _id: 0
                }
            }
        ]);

        // Verificar si no se encontraron membresías
        if (resultado.length === 0) {
            return { error: 'No se ha encontrado ninguna membresía para este usuario.' };
        }

        return resultado;
    } catch (error) {
        console.error('Error al obtener las membresías del usuario:', error);
        throw new Error('Error al obtener las membresías del usuario');
    }
};

//Servicio para que el usuario tenga su membresía o que el admin vea solo un usuario
const getMembresia = async (membresiaId) => {
    try {
        // Realizar una agregación para obtener la membresía con el nombre del plan y datos del usuario
        const membresia = await Membresia.aggregate([
            // Filtra la membresía por su _id
            { $match: { _id: new mongoose.Types.ObjectId(membresiaId) } },

            // Realiza un "join" con la colección de Planes usando el campo plan_id
            {
                $lookup: {
                    from: 'planes', // Nombre de la colección de Planes
                    localField: 'plan_id', // Campo en la colección Membresia
                    foreignField: '_id', // Campo en la colección Plan
                    as: 'plan' // Nombre del campo donde se almacenará el resultado del join
                }
            },

            // Descomponer el array "plan" (resultado del $lookup) en un objeto
            { $unwind: '$plan' },

            // Realiza un "join" con la colección de Usuarios usando el campo membresia_id
            {
                $lookup: {
                    from: 'usuarios', // Nombre de la colección de Usuarios
                    localField: '_id', // Campo en la colección Membresia
                    foreignField: 'membresia_id', // Campo en la colección Usuario
                    as: 'usuario' // Nombre del campo donde se almacenará el resultado del join
                }
            },

            // Descomponer el array "usuario" (resultado del $lookup) en un objeto
            { $unwind: '$usuario' },

            // Proyectar los campos que deseas devolver
            {
                $project: {
                    _id: 1, // Incluir el _id de la membresía
                    fecha_inicio: 1, // Incluir la fecha de inicio de la membresía
                    fecha_fin: 1, // Incluir la fecha de fin de la membresía
                    plan_id: '$plan._id', //_id del plan
                    nombrePlan: '$plan.nombre', // Incluir el nombre del plan
                    nombreCompelto: '$usuario.nombre_completo', // Incluir el nombre del usuario
                    email: '$usuario.email', // Incluir el email del usuario
                    telefono: '$usuario.telefono', // Incluir el télefono del usuario
                    imagen: '$usuario.imagen', // Incluir la imagen del usuario
                    gym_id: 1
                }
            }
        ]);

        // Verificar si no se encontró la membresía
        if (membresia.length === 0) {
            return { error: 'No se ha encontrado la membresía con ese ID.' };
        }

        // Retornar los datos de la membresía con el nombre del plan y datos del usuario
        return membresia[0];
    } catch (error) {
        console.error('Error al obtener la membresía:', error);
        throw new Error('Error al obtener la membresía');
    }
};

//Servicio para aplazar fecha_fin
const aplazarMembresia = async(membresia_id, plan_id) => {
    try{
        //Obtenemos la membresía 
        const membresia = await Membresia.findById(membresia_id);

        //Obtenemos el plna de membresía
        const planSeleccionado = await plan.findById(plan_id);
        
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
            if (fecha_fin_original > fecha_actual) {
                //Programar un cambio de plan_id cuando llegue la fecha_fin_original
                const tiempoRestante = fecha_fin_original.getTime() - fecha_actual.getTime();

                setTimeout(async () => {
                    //Cambiar el plan_id cuadno llegue la fecha original
                    membresia.plan_id = plan_id;
                    await membresia.save();
                    console.log(`El plan de la membresía ${membresia_id} ha sido actualizado a ${plan_id}`);
                }, tiempoRestante);

                console.log(`El plan se actualizará automáticamente el ${fecha_fin_original}`);
            } else{
                //Si la fecha_fin original ya pasó, cambiar el plan_id de inmediato
                membresia.plan_id = plan_id;
            }
        }

        //Actualizar la membresía con la nueva fecha_fin y posiblemente nuevo plan_id
        membresia.fecha_fin = nueva_fecha_fin;
        await membresia.save();

        // Crear un nuevo pago por el aplazamiento de la membresía
        const nuevoPago = await Pago.create({
            membresia_id: membresia._id,
            gym_id: membresia.gym_id,
            fecha_hora: fecha_actual, // Fecha y hora actual para el nuevo pago
            concepto: planSeleccionado.nombre,
            monto: planSeleccionado.costo
        });

        return {membresia, pago: nuevoPago}; // Retornar la membresía actualizada
    }catch (error){
        console.error('Error al aplazar la membresía:', error);
        throw new Error('Error al aplazar la membresía');
    }
};

module.exports = { registroUsuario, crearMembresia, getMembresias, getMembresiasCount, getMembresiasUser, getMembresia, aplazarMembresia, getTotalMembresias };