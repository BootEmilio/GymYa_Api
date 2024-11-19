const db = require('../db');

const getPaginatedUsers = async (limit, offset) => {
    const query = `
        SELECT * FROM accesos_usuarios
        LIMIT $1 OFFSET $2;
    `;
    const { rows } = await db.query(query, [limit, offset]);
    return rows;
};

const getTotalUsers = async () => {
    const query = `SELECT COUNT(*) FROM usuarios;`;
    const { rows } = await db.query(query);
    return parseInt(rows[0].count, 10);
};

const getUserById = async (id) => {
    const result = await db.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    return result.rows[0];
};

const createUser = async (user) => {
    const query = `
        INSERT INTO usuarios (nombre_completo, fecha_registro, telefono, activo, username, password)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [user.nombre_completo, user.fecha_registro, user.telefono, user.activo, user.username, user.password];
    const result = await db.query(query, values);
    return result.rows[0];
};

const updateUser = async (id, userData) => {
    const query = `
        UPDATE usuarios
        SET nombre_completo = $1, fecha_registro = $2, telefono = $3, activo = $4, username = $5, password = $6
        WHERE id = $7 RETURNING *`;
    const values = [userData.nombre_completo, userData.fecha_registro, userData.telefono, userData.activo, userData.username, userData.password, id];
    const result = await db.query(query, values);
    return result.rows[0];
};

const deleteUser = async (id) => {
    await db.query('DELETE FROM usuarios WHERE id = $1', [id]);
};

module.exports = {
    getPaginatedUsers,
    getTotalUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};