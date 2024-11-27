const db = require('../db');

const getPaginatedAccesos = async (limit, offset) => {
    const query = `
        SELECT * FROM accesos_usuarios
        ORDER BY fecha_hora_acceso DESC
        LIMIT $1 OFFSET $2;
    `;
    const { rows } = await db.query(query, [limit, offset]);
    return rows;
};

const getTotalAccesos = async () => {
    const query = `SELECT COUNT(*) FROM accesos_usuarios;`;
    const { rows } = await db.query(query);
    return parseInt(rows[0].count, 10);
};

const getAccesosById = async (id) => {
    const query = `SELECT * FROM accesos_usuarios WHERE id = $1;`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
};

module.exports = {
    getPaginatedAccesos,
    getTotalAccesos,
    getAccesosById,
};
