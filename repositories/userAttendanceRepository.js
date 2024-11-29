const db = require('../db');

const createAsistencia = async (usuario_id, tipo_acceso, gym_id) => {
    const query = `
        INSERT INTO asistencias (usuario_id, tipo_acceso, gym_id)
        VALUES ($1, $2, $3) RETURNING *;
    `;
    const values = [usuario_id, tipo_acceso, gym_id];
    const result = await db.query(query, values);
    return result.rows[0];
};

const getAsistenciasByUserId = async (usuario_id, limit, offset) => {
    const query = `
        SELECT * FROM asistencias
        WHERE usuario_id = $1
        ORDER BY fecha_hora DESC
        LIMIT $2 OFFSET $3;
    `;
    const { rows } = await db.query(query, [usuario_id, limit, offset]);
    return rows;
};

const getTotalAsistenciasByUserId = async (usuario_id) => {
    const query = `SELECT COUNT(*) FROM asistencias WHERE usuario_id = $1;`;
    const { rows } = await db.query(query, [usuario_id]);
    return parseInt(rows[0].count, 10);
};

module.exports = {
    createAsistencia,
    getAsistenciasByUserId,
    getTotalAsistenciasByUserId,
};
