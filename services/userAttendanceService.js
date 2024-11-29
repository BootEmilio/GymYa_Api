const userAttendanceRepository = require('../repositories/userAttendanceRepository');

// Crear una nueva asistencia
const createAsistencia = async (userId, tipo_acceso, gymId) => {
    if (!['entrada', 'salida'].includes(tipo_acceso)) {
        throw new Error('El tipo de acceso debe ser "entrada" o "salida"');
    }
    return await userAttendanceRepository.createAsistencia(userId, tipo_acceso, gymId);
};

// Obtener las asistencias de un usuario con paginación
const getAsistenciasByUserId = async (userId, limit, offset) => {
    return await userAttendanceRepository.getAsistenciasByUserId(userId, limit, offset);
};

// Obtener el total de asistencias de un usuario
const getTotalAsistenciasByUserId = async (userId) => {
    return await userAttendanceRepository.getTotalAsistenciasByUserId(userId);
};

module.exports = {
    createAsistencia,
    getAsistenciasByUserId,
    getTotalAsistenciasByUserId,
};
