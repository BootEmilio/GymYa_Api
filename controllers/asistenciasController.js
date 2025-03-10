const asistenciasService = require('../services/asistenciasService');
const Membresia = require('../models/membresias');
const Gym = require('../models/gym');

//Controlador para que el registre las entradas y salidas (por ahora por medio de peticiones, cambiar para registro de QR)
const registrarAsistencia = async (req, res) => {
    try{
        const { gymId } = req.params; // Obtenemos los datos de la URL
        const { membresia_id, fecha_hora } = req.body; //Obtener los datos de la petición

        //Validar que se pasaron todos los datos
        if(!membresia_id || !fecha_hora) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        //Buscamos el _id de la membresía
        const membresia = await Membresia.findById(membresia_id);
        if(!membresia) {
            res.status(400).json({  error: 'La membresía no existe'});
        }

        // Verificar que el gymId esté en el array gym_id de la membresía
        if (!membresia.gym_id.includes(gymId)) {
            return res.status(400).json({ error: 'El gimnasio no está asociado a esta membresía, no tiene acceso' });
        }

        const fechaFin = membresia.fecha_fin;
        // Verificamos que la fecha_fin dentro del QR es mayor a la fecha actual
        if(fechaFin < new Date()) {
            res.status(400).json({ error: 'Su membresía esta expirada, no tiene acceso al gimnasio'});
        }

        const nuevaAsistencia = await asistenciasService.registrarAsistencia(gymId, membresia_id, fecha_hora);

        res.status(201).json(nuevaAsistencia);
    }catch(error){
        res.status(500).json({error: 'Error al registrar el usuario junto a su membresía'});
    }
}

//Controlador para que el admin vea las asistencias del día u otra fecha
const verAsistencias = async (req, res) => {
    try {
        const {gymId} = req.params; // Obtener el gym_id desde la url
        const { fecha, search, page = 1, limit = 10 } = req.query; // Parámetros opcionales

        const gimnasio = await Gym.findById(gymId);
        if(!gimnasio) {
            res.status(400).json({  error: 'No existe el gimnasio'});
        }

        // Llamada al servicio para obtener las asistencias paginadas
        const { asistencias, total } = await asistenciasService.verAsistencias(gymId, fecha, search, parseInt(page), parseInt(limit));

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

//Controlador para ver última asistencia
const verAsistencia = async (req, res) => {
    try {
        const { membresiaId } = req.params; //Obtenemos el _id de la URL

        //Buscamos el _id de la membresía
        const membresia = await Membresia.findById(membresiaId);
        if(!membresia) {
            res.status(400).json({  error: 'La membresía no existe'});
        }

        const ultimaEntrada = await asistenciasService.verAsistencia(membresiaId);

        if (!ultimaEntrada) {
            return res.status(404).json({
                success: false,
                message: "Aún no hay entradas en el gimnasio proporcionado."
            });
        }

        // Si se encuentra la última entrada, devolverla
        res.status(200).json({
            success: true,
            data: ultimaEntrada
        });
    } catch (error) {
        console.error("Error en el controlador getUltimaEntrada:", error.message);
        res.status(500).json({
            success: false,
            message: `Error al obtener la última entrada: ${error.message}`
        });
    }
}

//Controlador para que el usuario vea todas sus asitencias agrupadas
const verAsistenciasUser = async (req, res) => {
    try {
        const { membresiaId } = req.params; // Obtener el _id de la membresía por medio de
        const { page = 1, limit = 8 } = req.query; // Parámetros opcionales de paginación

        //Buscamos el _id de la membresía
        const membresia = await Membresia.findById(membresiaId);
        if(!membresia) {
            res.status(400).json({  error: 'La membresía no existe'});
        }

        // Llamada al servicio para obtener las asistencias del usuario
        const { asistencias, total } = await asistenciasService.verAsistenciasUser(membresiaId, parseInt(page), parseInt(limit));

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

module.exports = { registrarAsistencia, verAsistencias, verAsistencia, verAsistenciasUser };
