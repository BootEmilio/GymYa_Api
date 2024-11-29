const db = require('../db');

const getPaginatedUsers = async (gym_id, limit, offset) => {
    const query = `
        SELECT * FROM usuarios
        WHERE gym_id = $1
        LIMIT $2 OFFSET $3;
    `;
    const { rows } = await db.query(query, [gym_id, limit, offset]);
    return rows;
};

const getTotalUsers = async (gym_id) => {
    const query = `SELECT COUNT(*) FROM usuarios WHERE gym_id = $1;`;
    const { rows } = await db.query(query, [gym_id]);
    return parseInt(rows[0].count, 10);
};

const getUserById = async (gym_id, id) => {
    const query = `SELECT * FROM usuarios WHERE id = $1 AND gym_id = $2;`;
    const result = await db.query(query, [id, gym_id]);
    return result.rows[0];
};

const createUser = async (user) => {
    const query = `
        INSERT INTO usuarios (gym_id, username, password, nombre_completo, email, telefono, fecha_registro)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `;
    const values = [
        user.gym_id,
        user.username,
        user.password,
        user.nombre_completo,
        user.email,
        user.telefono,
        user.fecha_registro,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
};


const updateUser = async (gym_id, id, userData) => {
    const query = `
        UPDATE usuarios
        SET username = $1, password = $2, nombre_completo = $3, email = $4, telefono = $5
        WHERE id = $6 AND gym_id = $7
        RETURNING *;
    `;
    const values = [
        userData.username,
        userData.password,
        userData.nombre_completo,
        userData.email,
        userData.telefono,
        id,
        gym_id,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
};

const deleteUser = async (gym_id, id) => {
    const query = `DELETE FROM usuarios WHERE id = $1 AND gym_id = $2;`;
    await db.query(query, [id, gym_id]);
};

module.exports = {
    getPaginatedUsers,
    getTotalUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
