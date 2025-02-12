const asistenciasService = require('../services/asistenciasService');

//Controlador para que el registre las entradas y salidas (por ahora por medio de peticiones, cambiar para registro de QR)
const registrarAsistencia = async (req, res) => {
    try{
        const { membresia_id, fecha_fin } = req.body; //Obtener los datos de la petición

        //Validar que se pasaron todos los datos
        if(!membresia_id || !fecha_fin) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const nuevaAsistencia = await asistenciasService.registrarAsistencia(membresia_id, fecha_fin);

        res.status(201).json(nuevaAsistencia);
    }catch(error){
        res.status(500).json({error: 'Error al registrar el usuario junto a su membresía'});
    }
}

//Controlador para que el admin vea las asistencias del día u otra fecha
const verAsistencias = async (req, res) => {
    try {
        const gym_id = req.user.gym_id; // Obtener el gym_id desde el token del usuario
        const { fecha, search, page = 1, limit = 10 } = req.query; // Parámetros opcionales

        // Llamada al servicio para obtener las asistencias paginadas
        const { asistencias, total } = await asistenciasService.verAsistencias(gym_id, fecha, search, parseInt(page), parseInt(limit));

        // Responder con los datos paginados
        res.status(200).json({
            asistencias,        // Lista de asistencias (emparejadas)
            total,              // Total de registros
            page: parseInt(page), // Página actual
            limit: parseInt(limit), // Límite de resultados por página
            totalPages: Math.ceil(total / limit) // Calcular número de páginas totales
        });
    } catch (error) {
        console.error('Error en obtener las asistencias:', error);
        res.status(500).json({
            error: 'Ocurrió un error al obtener las asistencias.'
        });
    }
};

//Controlador para que el usuario vea todas sus asitencias agrupadas
const verAsistenciasUser = async (req, res) => {
    try {
        const usuario_id = req.user._id; // Obtener el usuario_id desde el token de autenticación
        const { page = 1, limit = 10 } = req.query; // Parámetros opcionales de paginación

        // Llamada al servicio para obtener las asistencias del usuario
        const { asistencias, total } = await asistenciasService.verAsistenciasUser(usuario_id, parseInt(page), parseInt(limit));

        // Devolver la respuesta con los datos paginados
        res.status(200).json({
            asistencias,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit) // Calcular número de páginas
        });
    } catch (error) {
        console.error('Error en obtener las asistencias del usuario:', error);
        res.status(500).json({
            error: 'Ocurrió un error al obtener las asistencias del usuario.'
        });
    }
};

module.exports = { registrarAsistencia, verAsistencias, verAsistenciasUser };
