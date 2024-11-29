const userAttendanceRepository = require('../repositories/userAttendanceRepository');

const createAsistencia = async (usuario_id, tipo_acceso, gym_id) => {
    if (!tipo_acceso) {
        throw new Error('El tipo de acceso es obligatorio');
    }

    if (!gym_id) {
        throw new Error('El gym_id es obligatorio');
    }

    return await userAttendanceRepository.createAsistencia(usuario_id, tipo_acceso, gym_id);
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
