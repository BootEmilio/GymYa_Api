const userAttendanceService = require('../services/userAttendanceService');

const createAsistencia = async (req, res) => {
    try {
        const { usuario_id } = req.body;

        // Extraer el id_gimnasio del token (agregado por el middleware de autenticación)
        const gym_id = req.user.gym_id;

        if (!usuario_id) {
            return res.status(400).json({ message: 'El usuario_id es obligatorio' });
        }

        const nuevaAsistencia = await userAttendanceService.createAsistencia(gym_id, usuario_id);

        res.status(201).json({
            message: 'Asistencia creada exitosamente',
            asistencia: nuevaAsistencia,
        });
    } catch (error) {
        console.error('Error al crear asistencia:', error);
        res.status(500).json({ error: error.message });
    }
};

const getAsistencias = async (req, res) => {
    try {
        const usuario_id = req.user.id; // Extraer el ID del usuario desde el JWT
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
