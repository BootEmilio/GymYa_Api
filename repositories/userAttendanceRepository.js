const db = require('../db');

// Crear una nueva asistencia (entrada o salida)
const createAsistencia = async (userId, tipo_acceso, gymId) => {
    const query = `
        INSERT INTO asistencias (usuario_id, tipo_acceso, gym_id)
        VALUES ($1, $2, $3) RETURNING *;
    `;
    const { rows } = await db.query(query, [userId, tipo_acceso, gymId]);
    return rows[0];
};

// Obtener las asistencias de un usuario con paginación
const getAsistenciasByUserId = async (userId, limit, offset) => {
    const query = `
        SELECT * FROM asistencias
        WHERE usuario_id = $1
        ORDER BY fecha_hora DESC
        LIMIT $2 OFFSET $3;
    `;
    const { rows } = await db.query(query, [userId, limit, offset]);
    return rows;
};

// Contar el total de asistencias de un usuario
const getTotalAsistenciasByUserId = async (userId) => {
    const query = `SELECT COUNT(*) FROM asistencias WHERE usuario_id = $1;`;
    const { rows } = await db.query(query, [userId]);
    return parseInt(rows[0].count, 10);
};

module.exports = {
    createAsistencia,
    getAsistenciasByUserId,
    getTotalAsistenciasByUserId,
};
