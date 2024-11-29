const db = require('../db');

const getPaginatedAccesos = async (gymId, limit, offset) => {
    const query = `
        SELECT * FROM accesos_usuarios
        WHERE gym_id = $1
        ORDER BY fecha_hora_acceso DESC
        LIMIT $2 OFFSET $3;
    `;
    const { rows } = await db.query(query, [gymId, limit, offset]);
    return rows;
};

const getTotalAccesos = async (gymId) => {
    const query = `SELECT COUNT(*) FROM accesos_usuarios WHERE gym_id = $1;`;
    const { rows } = await db.query(query, [gymId]);
    return parseInt(rows[0].count, 10);
};

const getAccesosById = async (id, gymId) => {
    const query = `
        SELECT * FROM accesos_usuarios 
        WHERE id = $1 AND gym_id = $2;
    `;
    const { rows } = await db.query(query, [id, gymId]);
    return rows[0];
};

module.exports = {
    getPaginatedAccesos,
    getTotalAccesos,
    getAccesosById,
};
