const userAttendanceService = require('../services/userAttendanceService');

const createAsistencia = async (req, res) => {
    try {
        const usuario_id = req.user.id; // Extraer el ID del usuario desde el token JWT
        const { tipo_acceso } = req.body; // Recibe solo el tipo de acceso desde el cuerpo

        const asistencia = await userAttendanceService.createAsistencia(usuario_id, tipo_acceso);

        res.status(201).json({
            message: 'Asistencia registrada exitosamente',
            asistencia,
        });
    } catch (error) {
        console.error('Error al registrar la asistencia:', error);
        res.status(500).json({ message: error.message });
    }
};

const getAsistencias = async (req, res) => {
    try {
        const usuario_id = req.user.id; // Extraer el ID del usuario desde el token JWT
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { data, totalItems, totalPages } = await userAttendanceService.getAsistenciasByUserId(usuario_id, limit, offset);

        res.status(200).json({
            currentPage: page,
            totalPages,
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
