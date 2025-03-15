const Asistencia = require('../models/asistencias');
const Membresia = require('../models/asistencias');
const mongoose = require('mongoose');

//Servicio para extraer datos del código QR y registrar así una asistencia (entrada/salida)
const registrarAsistencia = async (gymId, membresiaId, fecha_hora) => {
    try{
        //Buscamos el último registro de asistencia de la membresía dentro del gimnasio
        const ultimaAsistencia = await Asistencia.findOne({
            membresia_id: membresiaId,
            gym_id: gymId
        }).sort({ fecha_hora: -1 }); //Ordenar por las más recientes

        let tipo_acceso = 'Entrada'; //Valor por defecto
        let mensaje = 'Puede pasar al gimnasio'; // Mensaje por defecto para entradas

        if(ultimaAsistencia && ultimaAsistencia.tipo_acceso === 'Entrada') {
            tipo_acceso = 'Salida'; // Si la última asistencia fue 'Entrada', la siguiente será 'Salida'
            mensaje = 'Gracias por su visita'; // Mensaje para salidas
        }

        // Actualizar el campo `activo` en el modelo `Membresia`
        const membresiaActualizada = await Membresia.findByIdAndUpdate(
            membresiaId,
            { activo: tipo_acceso === 'Entrada' }, // true si es Entrada, false si es Salida
            { new: true } // Devuelve el documento actualizado
        );

        //Creamos la asistencia
        const nuevaAsistencia = await Asistencia.create({
            membresia_id: membresiaId,
            gym_id: gymId,
            tipo_acceso: tipo_acceso,
            fecha_hora: fecha_hora
        })

        return{ success: true, message: mensaje, asistencia: nuevaAsistencia, membresia: membresiaActualizada };
    }catch(error){
        console.error('Erros al registrar la asistencia:', error);
        throw new Error('Error al registrar al la asistencia');
    }
};

//Servicio para que el administrador vea las asistencias (paginadas y poder cambiar los días a ver)
const verAsistencias = async (gym_id, fecha, search = '', page = 1, limit = 10) => {
    try {
        let searchCondition = {};
        if (search) {
            const searchConditions = [
                { 'usuario.nombre_completo': { $regex: search, $options: 'i' } },
                { 'usuario.username': { $regex: search, $options: 'i' } }
            ];

            if (mongoose.Types.ObjectId.isValid(search)) {
                searchConditions.push({ '_id': new mongoose.Types.ObjectId(search) });
            }

            searchCondition = { $or: searchConditions };
        }

        let fechaInicio, fechaFin;

        if (!fecha) {
            const hoy = new Date();
            fechaInicio = new Date(hoy.setHours(0, 0, 0, 0)); // Inicio del día
            fechaFin = new Date(hoy.setHours(23, 59, 59, 999)); // Fin del día
        } else {
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
                    from: 'usuarios', // Colección de usuarios
                    localField: 'membresia_id', // Campo en asistencias
                    foreignField: 'membresia_id', // Campo en colección de usuarios (array)
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
                        usuario_id: '$usuario._id',
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
                $skip: (page - 1) * limit 
            }, 
            { 
                $limit: parseInt(limit) 
            }
        ]);

        // Contar el número de usuarios únicos con asistencias
        const totalUsuarios = await Asistencia.aggregate([
            {
                $match: {
                    gym_id: new mongoose.Types.ObjectId(gym_id),
                    fecha_hora: { $gte: fechaInicio, $lte: fechaFin }
                }
            },
            {
                $lookup: {
                    from: 'usuarios',
                    localField: 'membresia_id',
                    foreignField: 'membresia_id',
                    as: 'usuario'
                }
            },
            { $unwind: '$usuario' },
            {
                $group: {
                    _id: '$usuario._id' // Agrupar por usuario
                }
            },
            {
                $count: 'totalUsuarios' // Contar usuarios únicos
            }
        ]);

        const total = totalUsuarios.length > 0 ? totalUsuarios[0].totalUsuarios : 0;

        // Procesar el resultado para emparejar entradas con salidas
        const asistenciasEmparejadas = asistencias.map(usuario => {
            const { _id, asistencias } = usuario;
            const emparejadas = [];

            let entradaActual = null;

            // Verificar que asistencias no sea undefined ni vacío
            if (asistencias && asistencias.length > 0) {
                asistencias.forEach(asistencia => {
                    if (asistencia.tipo_acceso === 'Entrada') {
                        if (entradaActual) {
                            emparejadas.push({ entrada: entradaActual, salida: null });
                        }
                        entradaActual = asistencia;
                    } else if (asistencia.tipo_acceso === 'Salida' && entradaActual) {
                        emparejadas.push({ entrada: entradaActual, salida: asistencia });
                        entradaActual = null;
                    }
                });

                if (entradaActual) {
                    emparejadas.push({ entrada: entradaActual, salida: null });
                }
            }

            return {
                usuario_id: _id.usuario_id,
                nombre_completo: _id.nombre_completo,
                asistencias: emparejadas
            };
        });

        return { 
            asistencias: asistenciasEmparejadas, 
            total, 
            page, 
            limit, 
            totalPages: Math.ceil(total / limit) 
        };
    } catch (error) {
        console.error(`Error al mostrar las asistencias del día ${fecha} para gymId: ${gym_id}:`, error);
        throw new Error(`Error al mostrar las asistencias del día ${fecha}`);
    }
};

//Servicio para que el usuario vea su última asistencia
const verAsistencia = async (membresiaId) => {
    try {
        // Realizar una agregación para obtener la última asistencia con el nombre del gimnasio
        const ultimaEntrada = await Asistencia.aggregate([
            // Filtra las asistencias por membresia_id y tipo_acceso = "Entrada"
            {
                $match: {
                    membresia_id: new mongoose.Types.ObjectId(membresiaId),
                    tipo_acceso: "Entrada"
                }
            },

            // Ordenar por fecha_hora en orden descendente (la más reciente primero)
            { $sort: { fecha_hora: -1 } },

            // Limitar a 1 resultado (la última entrada)
            { $limit: 1 },

            // Realizar un "join" con la colección de Gimnasios usando el campo gimnasio_id
            {
                $lookup: {
                    from: 'gimnasios', // Nombre de la colección de Gimnasios
                    localField: 'gym_id', // Campo en la colección Asistencia
                    foreignField: '_id', // Campo en la colección Gimnasio
                    as: 'gimnasio' // Nombre del campo donde se almacenará el resultado del join
                }
            },

            // Descomponer el array "gimnasio" (resultado del $lookup) en un objeto
            { $unwind: '$gimnasio' },

            // Proyectar los campos que deseas devolver
            {
                $project: {
                    _id: 1, // Incluir el _id de la asistencia
                    fecha_hora: 1, // Incluir la fecha y hora de la asistencia
                    tipo_acceso: 1, // Incluir el tipo de acceso
                    gimnasioNombre: '$gimnasio.nombre' // Incluir el nombre del gimnasio
                }
            }
        ]);

        // Verificar si no se encontró ninguna asistencia
        if (ultimaEntrada.length === 0) {
            return null;
        }

        // Retornar la última asistencia con el nombre del gimnasio
        return ultimaEntrada[0];
    } catch (error) {
        console.error(`Error al obtener la última entrada para membresia_id ${membresiaId}:`, error.message);
        throw new Error(`Error al obtener la última entrada para membresia_id ${membresiaId}: ${error.message}`);
    }
};

//Servicio para que el usuario vea sus asistencias (paginadas y poder cambiar los días a ver)
const verAsistenciasUser = async (membresiaId, page = 1, limit = 8) => {
    try {
        // Realizar una agregación para obtener las asistencias con el nombre del gimnasio
        const asistencias = await Asistencia.aggregate([
            // Filtra las asistencias por membresia_id
            {
                $match: {
                    membresia_id: new mongoose.Types.ObjectId(membresiaId),
                },
            },

            // Ordenar por fecha_hora en orden descendente (la más reciente primero)
            { $sort: { fecha_hora: -1 } },

            // Realizar un "join" con la colección de Gimnasios usando el campo gimnasio_id
            {
                $lookup: {
                    from: 'gimnasios', // Nombre de la colección de Gimnasios
                    localField: 'gym_id', // Campo en la colección Asistencia
                    foreignField: '_id', // Campo en la colección Gimnasio
                    as: 'gimnasio', // Nombre del campo donde se almacenará el resultado del join
                },
            },

            // Descomponer el array "gimnasio" (resultado del $lookup) en un objeto
            { $unwind: '$gimnasio' },

            // Proyectar los campos que deseas devolver
            {
                $project: {
                    _id: 1, // Incluir el _id de la asistencia
                    fecha_hora: 1, // Incluir la fecha y hora de la asistencia
                    tipo_acceso: 1, // Incluir el tipo de acceso
                    gimnasioNombre: '$gimnasio.nombre', // Incluir el nombre del gimnasio
                },
            },
        ]);

        // Paginar las asistencias
        const total = asistencias.length;
        const paginatedAsistencias = asistencias.slice((page - 1) * limit, page * limit);

        // Devolver los datos paginados
        return {
            asistencias: paginatedAsistencias,
            total: total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
        };
    } catch (error) {
        console.error(`Error al mostrar las asistencias para membresia_id ${membresiaId}:`, error.message);
        throw new Error(`Error al mostrar las asistencias para membresia_id ${membresiaId}: ${error.message}`);
    }
};

module.exports = { registrarAsistencia, verAsistencias, verAsistencia, verAsistenciasUser };