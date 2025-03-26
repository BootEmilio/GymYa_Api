const Asistencia = require('../models/asistencias');
const mongoose = require('mongoose');

//Servicio para extraer datos del código QR y registrar así una asistencia (entrada/salida)
const registrarAsistencia = async (gymId, membresiaId, fecha_hora) => {
    try {
        // Buscar la última asistencia de la membresía en el gimnasio
        const ultimaAsistencia = await Asistencia.findOne({
            membresia_id: membresiaId,
            gym_id: gymId
        }).sort({ fecha_hora_entrada: -1 }); // Ordenar por fecha_hora_entrada descendente (la más reciente)

        let mensaje = 'Puede pasar al gimnasio'; // Mensaje por defecto para entradas
        let asistencia = null; // Variable para guardar la asistencia

        if (ultimaAsistencia && !ultimaAsistencia.fecha_hora_salida) {
            // Si la última asistencia no tiene salida registrada, actualizar con la hora de salida
            asistencia = await Asistencia.findByIdAndUpdate(
                ultimaAsistencia._id,
                { fecha_hora_salida: fecha_hora, salida_registrada: true }, // Registrar la salida
                { new: true } // Devolver el documento actualizado
            );
            mensaje = 'Gracias por su visita'; // Mensaje para salida
        } else {
            // Si la última asistencia ya tiene entrada y salida, crear una nueva entrada
            asistencia = await Asistencia.create({
                membresia_id: membresiaId,
                gym_id: gymId,
                fecha_hora_entrada: fecha_hora, // Registrar la nueva entrada
                salida_registrada: false // Nueva entrada, aún no se registra salida
            });
        }

        return { success: true, message: mensaje, asistencia: asistencia };

    } catch (error) {
        console.error('Error al registrar la asistencia:', error);
        throw new Error('Error al registrar la asistencia');
    }
};

//Servicio para que el administrador vea las asistencias (paginadas y poder cambiar los días a ver)
const verAsistencias = async (gym_id, fecha, search = '', page = 1, limit = 10) => {
    try {
        let searchCondition = {};
        if (search) {
            const searchConditions = [
                { 'usuario.nombre_completo': { $regex: search, $options: 'i' } },
                { 'usuario.email': { $regex: search, $options: 'i' } }
            ];

            if (mongoose.Types.ObjectId.isValid(search)) {
                searchConditions.push({ '_id': new mongoose.Types.ObjectId(search) });
            }

            searchCondition = { $or: searchConditions };
        }

        let fechaInicio, fechaFin;

        if (!fecha) {
            const hoy = new Date();
            fechaInicio = new Date(hoy.setHours(0, 0, 0, 0)); // Inicio del día actual
            fechaFin = new Date(hoy.setHours(23, 59, 59, 999)); // Fin del día actual
        } else {
            const fechaConsulta = new Date(fecha);
            fechaInicio = new Date(fechaConsulta.setHours(0, 0, 0, 0)); // Inicio del día consultado
            fechaFin = new Date(fechaConsulta.setHours(23, 59, 59, 999)); // Fin del día consultado
        }

        const asistencias = await Asistencia.aggregate([
            {
                $match: {
                    gym_id: new mongoose.Types.ObjectId(gym_id),
                    fecha_hora_entrada: { $gte: fechaInicio, $lte: fechaFin } // Filtrar por rango de fechas
                }
            },
            {
                $lookup: {
                    from: 'usuarios', // Colección de usuarios
                    localField: 'membresia_id', // Campo en asistencias
                    foreignField: 'membresia_id', // Campo en la colección de usuarios
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
                            fecha_hora_entrada: '$fecha_hora_entrada',
                            fecha_hora_salida: '$fecha_hora_salida'
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
                    fecha_hora_entrada: { $gte: fechaInicio, $lte: fechaFin }
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

        // No es necesario emparejar entradas con salidas, ya que ambas están en el mismo registro
        const asistenciasProcesadas = asistencias.map(usuario => ({
            usuario_id: usuario._id.usuario_id,
            nombre_completo: usuario._id.nombre_completo,
            asistencias: usuario.asistencias.map(asistencia => ({
                asistencia_id: asistencia.asistencia_id,
                entrada: asistencia.fecha_hora_entrada,
                salida: asistencia.fecha_hora_salida || 'Aún en el gimnasio' // Mostrar mensaje si no hay salida
            }))
        }));

        return { 
            asistencias: asistenciasProcesadas, 
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

//Servicio para que el administrador vea los usuarios dentro del gym
const verActivos = async (gym_id, search = '', page = 1, limit = 10) => {
    try {
        let searchCondition = {};
        if (search) {
            const searchConditions = [
                { 'usuario.nombre_completo': { $regex: search, $options: 'i' } },
                { 'usuario.email': { $regex: search, $options: 'i' } }
            ];

            if (mongoose.Types.ObjectId.isValid(search)) {
                searchConditions.push({ '_id': new mongoose.Types.ObjectId(search) });
            }

            searchCondition = { $or: searchConditions };
        }

        const asistencias = await Asistencia.aggregate([
            {
                $match: {
                    gym_id: new mongoose.Types.ObjectId(gym_id),
                    salida_registrada: false // Filtrar por asistencias que aún no tienen salida
                }
            },
            {
                $lookup: {
                    from: 'usuarios', // Colección de usuarios
                    localField: 'membresia_id', // Campo en asistencias
                    foreignField: 'membresia_id', // Campo en la colección de usuarios
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
                        nombre_completo: '$usuario.nombre_completo',
                        imagen: '$usuario.imagen'
                    },
                    asistencias: {
                        $push: {
                            asistencia_id: '$_id',
                            fecha_hora_entrada: '$fecha_hora_entrada'
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

        return { 
            asistencias: asistencias, 
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
        // Realizar una agregación para obtener la última asistencia completa con el nombre del gimnasio
        const ultimaAsistencia = await Asistencia.aggregate([
            // Filtrar por membresia_id
            {
                $match: {
                    membresia_id: new mongoose.Types.ObjectId(membresiaId)
                }
            },

            // Ordenar por fecha_hora_entrada en orden descendente (la más reciente primero)
            { $sort: { fecha_hora_entrada: -1 } },

            // Limitar a 1 resultado (la última asistencia)
            { $limit: 1 },

            // Realizar un "join" con la colección de Gimnasios usando el campo gym_id
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
                    fecha_hora_entrada: 1, // Incluir la fecha y hora de entrada
                    fecha_hora_salida: 1, // Incluir la fecha y hora de salida (si existe)
                    gimnasioNombre: '$gimnasio.nombre' // Incluir el nombre del gimnasio
                }
            }
        ]);

        // Verificar si no se encontró ninguna asistencia
        if (ultimaAsistencia.length === 0) {
            return null;
        }

        // Retornar la última asistencia completa con el nombre del gimnasio
        return ultimaAsistencia[0];
    } catch (error) {
        console.error(`Error al obtener la última asistencia para membresia_id ${membresiaId}:`, error.message);
        throw new Error(`Error al obtener la última asistencia para membresia_id ${membresiaId}: ${error.message}`);
    }
};

//Servicio para que el usuario vea sus asistencias (paginadas y poder cambiar los días a ver)
const verAsistenciasUser = async (membresiaId, page = 1, limit = 5) => {
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
            { $sort: { fecha_hora_entrada: -1 } },

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
                    fecha_hora_entrada: 1, // Incluir la fecha y hora de la asistencia
                    fecha_hora_salida: 1, // Incluir la fecha y hora de la asistencia
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

// Servicio para contar los usuarios que hay dentro del gimnasio ahora
const contarAsistencias = async (gymId) => {
    try {
      // Contar las asistencias que pertenecen al gimnasio y no tienen salida registrada (salida_registrada: false)
      const usuariosDentro = await Asistencia.countDocuments({
        gym_id: new mongoose.Types.ObjectId(gymId), // Filtrar por el gimnasio
        salida_registrada: false // Solo las asistencias donde no se ha registrado la salida
      });
  
      return usuariosDentro; // Devuelve el número de usuarios que aún están dentro
    } catch (error) {
      console.error(`Error al contar los usuarios dentro del gimnasio ${gymId}:`, error);
      throw new Error(`Error al contar los usuarios dentro del gimnasio ${gymId}: ${error.message}`);
    }
  };  

module.exports = { registrarAsistencia, verAsistencias, verAsistencia, verActivos, verAsistenciasUser, contarAsistencias };