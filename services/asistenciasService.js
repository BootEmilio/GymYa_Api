const Asistencia = require('../models/asistencias');
const mongoose = require('mongoose')

//Servicio para extraer datos del código QR y registrar así una asistencia (entrada/salida)
const registrarAsistencia = async (gymId, membresiaId, fecha_hora) => {
    try{
        //Buscamos el último registro de asistencia de la membresía dentro del gimnasio
        const ultimaAsistencia = await Asistencia.findOne({
            membresia_id: membresiaId,
            gym_id: gymId
        }).sort({ fecha_hora: -1 }); //Ordenar por las más recientes

        let tipo_acceso = 'Entrada'; //Valor por defecto

        if(ultimaAsistencia && ultimaAsistencia.tipo_acceso === 'Entrada') {
            tipo_acceso = 'Salida'; // Si la última asistencia fue 'Entrada', la siguiente será 'Salida'
        }

        //Creamos la asistencia
        const nuevaAsistencia = await Asistencia.create({
            membresia_id: membresiaId,
            gym_id: gymId,
            tipo_acceso: tipo_acceso,
            fecha_hora: fecha_hora
        })

        //Si es una entrada, programamos la salida después de x tiempo (ahora es un minuto)
        if(tipo_acceso === 'Entrada') {
            const AUTO_LOGOUT_TIME = 3 * 60 * 60 * 1000; // 3 horas en milisegundos (3 * 60 * 60 * 1000)

            setTimeout(async () => {
                // Verificar si ya se registró una salida manualmente en este tiempo
                const salidaRegistrada = await Asistencia.findOne({
                    membresia_id: membresiaId,
                    gym_id: gymId,
                    tipo_acceso: 'Salida',
                    fecha_hora: { $gte: nuevaAsistencia.fecha_hora } // Buscar salidas después de esta entrada
                });

                // Si no se registró una salida, crearla automáticamente
                if (!salidaRegistrada) {
                    // Usar la fecha de entrada y sumarle el tiempo adicional (3 horas)
                    const fechaSalidaAutomatica = new Date(nuevaAsistencia.fecha_hora.getTime() + AUTO_LOGOUT_TIME);
                    await Asistencia.create({
                        membresia_id: membresiaId,
                        gym_id: gymId,
                        tipo_acceso: 'Salida',
                        fecha_hora: fechaSalidaAutomatica // Fecha actual, cuando se registra la salida automática
                    });

                    console.log('Salida automática registrada para el usuario:', membresia.usuario_id);
                }
            }, 60000) // 60000 milisegundos = 1 minuto
        }

        return{ success: true, message: 'Puede pasar al gimnasio', asistencia: nuevaAsistencia };
    }catch(error){
        console.error('Erros al registrar la asistencia:', error);
        throw new Error('Error al registrar al la asistencia');
    }
};

//Servicio para que el administrador vea las asistencias (paginadas y poder cambiar los días a ver)
const verAsistencias = async (gym_id, fecha = null, search = '', page = 1, limit = 10) => {
    try {
        // Verificar si gymId es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(gym_id)) {
            throw new Error('El gym_id proporcionado no es válido');
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

        // Obtener el rango de fechas (inicio y fin del día actual)
        let fechaInicio, fechaFin;

        // Si no se pasa una fecha específica, se filtra por el día actual
        if (!fecha) {
            const hoy = new Date();
            fechaInicio = new Date(hoy.setHours(0, 0, 0, 0)); // Inicio del día
            fechaFin = new Date(hoy.setHours(23, 59, 59, 999)); // Fin del día
        } else {
            // Si se proporciona una fecha, filtrar por ese día
            const fechaConsulta = new Date(fecha);
            fechaInicio = new Date(fechaConsulta.setHours(0, 0, 0, 0)); // Inicio del día consultado
            fechaFin = new Date(fechaConsulta.setHours(23, 59, 59, 999)); // Fin del día consultado
        }

        const asistencias = await Asistencia.aggregate([
            {
                $match: {
                    gym_id: new mongoose.Types.ObjectId(gym_id),
                    fecha_hora: { $gte: fechaInicio, $lte: fechaFin } // Filtrar por el rango de fechas
                }
            },
            {
                $lookup: {
                    from: 'usuarios', // Colección de usuario
                    localField: 'usuario_id', // Campo en asistencias
                    foreignField: '_id', // Campo en colección de usuarios
                    as: 'usuario'
                }
            },
            { $unwind: '$usuario' }, // Descomprimir el array de usuarios
            {
                $match: searchCondition // Aplicar la condición de búsqueda
            },
            {
                $group: {
                    _id: {
                        usuario_id: '$usuario_id',
                        nombre_completo: '$usuario.nombre_completo'
                    },
                    asistencias: {
                        $push: {
                            asistencia_id: '$_id',
                            fecha_hora: '$fecha_hora',
                            tipo_acceso: '$tipo_acceso'
                        }
                    }
                }
            },
            {
                $sort: {
                    'asistencias.fecha_hora': -1 // Ordenar cronológicamente las asistencias
                }
            },
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        { $skip: (page - 1) * limit },
                        { $limit: parseInt(limit) }
                    ] // Paginación
                }
            }
        ]);

        const resultado = asistencias[0].data;
        const total = asistencias[0].metadata.length > 0 ? asistencias[0].metadata[0].total : 0;

        // Procesar el resultado para emparejar entradas con salidas
        const asistenciasEmparejadas = resultado.map(usuario => {
            const { _id, asistencias } = usuario;
            const emparejadas = [];

            let entradaActual = null;

            asistencias.forEach(asistencia => {
                if (asistencia.tipo_acceso === 'Entrada') {
                    // Si ya hay una entrada en curso, emparejarla con la siguiente salida
                    if (entradaActual) {
                        emparejadas.push({ entrada: entradaActual, salida: null });
                    }
                    // Establecer la nueva entrada actual
                    entradaActual = asistencia;
                } else if (asistencia.tipo_acceso === 'Salida' && entradaActual) {
                    // Si hay una entrada en curso, emparejarla con esta salida
                    emparejadas.push({ entrada: entradaActual, salida: asistencia });
                    // Resetear la entrada actual
                    entradaActual = null;
                }
            });

            // Si quedó alguna entrada sin emparejar, la añadimos con salida null
            if (entradaActual) {
                emparejadas.push({ entrada: entradaActual, salida: null });
            }

            return {
                usuario_id: _id.usuario_id,
                nombre_completo: _id.nombre_completo,
                asistencias: emparejadas
            };
        });

        return { asistencias: asistenciasEmparejadas, total };
    } catch (error) {
        console.error(`Error al mostrar las asistencias del día ${fecha} para gymId: ${gym_id}:`, error);
        throw new Error(`Error al mostrar las asistencias del día ${fecha}`);
    }
};

//Servicio para que el usuario vea su última asistencia
const verAsistencia = async (membresiaId) => { 
    try {
        // Obtener la última asistencia de tipo "Entrada"
        const ultimaEntrada = await Asistencia.findOne({ 
            membresia_id: new mongoose.Types.ObjectId(membresiaId), 
            tipo_acceso: "Entrada" 
        }).sort({ fecha_hora: -1 }); // Ordenar por fecha_hora en orden descendente

        // Si no se encuentra ninguna asistencia de tipo "Entrada", devolver null
        if (!ultimaEntrada) {
            return null;
        }

        // Devolver la última asistencia de tipo "Entrada"
        return ultimaEntrada;
    } catch (error) {
        console.error(`Error al obtener la última entrada para usuario_id ${usuario_id}:`, error.message);
        throw new Error(`Error al obtener la última entrada para usuario_id ${usuario_id}: ${error.message}`);
    }
};

//Servicio para que el usuario vea sus asistencias (paginadas y poder cambiar los días a ver)
const verAsistenciasUser = async (membresiaId, page = 1, limit = 5) => {
    try {
        // Obtener todas las asistencias sin paginación
        const asistencias = await Asistencia.find({ membresia_id: new mongoose.Types.ObjectId(membresiaId) })
            .sort({ fecha_hora: -1 });

        // Paginar directamente las asistencias, sin emparejarlas
        const total = asistencias.length;
        const paginatedAsistencias = asistencias.slice((page - 1) * limit, page * limit);

        // Devolver los datos paginados
        return {
            asistencias: paginatedAsistencias,
            total: total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit)
        };
    } catch (error) {
        console.error(`Error al mostrar las asistencias para usuario_id ${usuario_id}:`, error.message);
        throw new Error(`Error al mostrar las asistencias para usuario_id ${usuario_id}: ${error.message}`);
    }
};

//Servicio para que el usuario vea cuantos usuarios hay en el gimnasio
const verCantidadAsistencias = async () => {
    try{

    }catch(error){

    }
};

module.exports = { registrarAsistencia, verAsistencias, verAsistencia, verAsistenciasUser, verCantidadAsistencias };