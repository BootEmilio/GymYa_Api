const userAttendanceService = require('../services/userAttendanceService');

// Crear una nueva asistencia (entrada o salida)
const createAsistencia = async (req, res) => {
    try {
        const userId = req.user.id; // Obtener ID del usuario desde el JWT
        const { tipo_acceso } = req.body; // Obtener el tipo de acceso del cuerpo de la solicitud
        const gymId = req.user.gym_id; // Obtener el ID del gimnasio desde el JWT

        const asistencia = await userAttendanceService.createAsistencia(userId, tipo_acceso, gymId);
        res.status(201).json({
            message: 'Asistencia registrada exitosamente',
            asistencia,
        });
    } catch (error) {
        console.error('Error al registrar la asistencia:', error);
        res.status(500).json({ message: 'Error al registrar la asistencia' });
    }
};

// Obtener el historial de asistencias de un usuario
const getAsistencias = async (req, res) => {
    try {
        const userId = req.user.id; // Obtener ID del usuario desde el JWT
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const data = await userAttendanceService.getAsistenciasByUserId(userId, limit, offset);
        const totalItems = await userAttendanceService.getTotalAsistenciasByUserId(userId);

        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
            totalItems,
            data,
        });
    } catch (error) {
        console.error('Error al obtener las asistencias:', error);
        res.status(500).json({ message: 'Error al obtener las asistencias' });
    }
};

module.exports = {
    createAsistencia,
    getAsistencias,
};
