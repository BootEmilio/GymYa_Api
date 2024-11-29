const db = require('../db');

// Crear un nuevo acceso para el usuario
const createAcceso = async (userId) => {
    const query = `
        INSERT INTO accesos_usuarios (usuario_id, fecha_hora_acceso)
        VALUES ($1, NOW()) RETURNING *;
    `;
    const { rows } = await db.query(query, [userId]);
    return rows[0];
};

// Obtener los accesos de un usuario específico (se filtra por userId)
const getAccesosByUserId = async (userId, limit, offset) => {
    const query = `
        SELECT * FROM accesos_usuarios
        WHERE usuario_id = $1
        ORDER BY fecha_hora_acceso DESC
        LIMIT $2 OFFSET $3;
    `;
    const { rows } = await db.query(query, [userId, limit, offset]);
    return rows;
};

// Obtener el total de accesos de un usuario específico (se filtra por userId)
const getTotalAccesosByUserId = async (userId) => {
    const query = `SELECT COUNT(*) FROM accesos_usuarios WHERE usuario_id = $1;`;
    const { rows } = await db.query(query, [userId]);
    return parseInt(rows[0].count, 10);
};

module.exports = {
    createAcceso,
    getAccesosByUserId,
    getTotalAccesosByUserId,
};
