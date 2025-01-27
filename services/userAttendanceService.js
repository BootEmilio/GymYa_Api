const userAttendanceRepository = require('../repositories/userAttendanceRepository');

const createAsistencia = async (gym_id, usuario_id) => {
    if (!gym_id || !usuario_id) {
        throw new Error('Todos los campos son obligatorios');
    }

    const nuevaAsistencia = await userAttendanceRepository.createAsistencia(gym_id, usuario_id);
    return nuevaAsistencia;
};

const getAsistenciasByUserId = async (usuario_id, limit, offset) => {
    const data = await userAttendanceRepository.getAsistenciasByUserId(usuario_id, limit, offset);
    const totalItems = await userAttendanceRepository.getTotalAsistenciasByUserId(usuario_id);

    const totalPages = Math.ceil(totalItems / limit);
    return { data, totalItems, totalPages };
};

module.exports = {
    createAsistencia,
    getAsistenciasByUserId,
};