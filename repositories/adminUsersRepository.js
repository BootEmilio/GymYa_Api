const db = require('../db');

const getGymIdByAdminId = async (adminId) => {
    const query = `SELECT gym_id FROM administradores WHERE id = $1;`;
    const { rows } = await db.query(query, [adminId]);
    return rows[0]?.gym_id || null;
};

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

const createUser = async (adminId, user) => {
    // Obtener el gym_id del administrador
    const gymResult = await db.query('SELECT gym_id FROM administradores WHERE id = $1', [adminId]);
    const gym_id = gymResult.rows[0]?.gym_id;

    if (!gym_id) {
        throw new Error('El administrador no está asociado a ningún gimnasio');
    }

    // Crear usuario asociado al gimnasio del administrador
    const query = `
        INSERT INTO usuarios (gym_id, username, password, nombre_completo, email, telefono, fecha_registro)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `;

    const values = [
        gym_id,                // $1: gym_id deducido
        user.username,         // $2
        user.password,         // $3
        user.nombre_completo,  // $4
        user.email,            // $5
        user.telefono,         // $6
        user.fecha_registro || new Date().toISOString(), // $7
    ];

    const result = await db.query(query, values);
    return result.rows[0];
};

const updateUser = async (gym_id, user_id, userData) => {
    const query = `
        UPDATE usuarios
        SET 
            username = $1, 
            password = $2, 
            nombre_completo = $3, 
            email = $4, 
            telefono = $5
        WHERE id = $6 AND gym_id = $7
        RETURNING *;
    `;

    const values = [
        userData.username,
        userData.password,
        userData.nombre_completo,
        userData.email,
        userData.telefono,
        user_id,
        gym_id,
    ];

    const result = await db.query(query, values);
    return result.rows[0]; // Retorna el usuario actualizado
};

const deleteUser = async (gym_id, user_id) => {
    const query = `DELETE FROM usuarios WHERE id = $1 AND gym_id = $2 RETURNING *;`;
    const { rows } = await db.query(query, [user_id, gym_id]);
    
    // Si no se encuentra el usuario, retorna null
    return rows.length > 0 ? rows[0] : null;
};

module.exports = {
    getPaginatedUsers,
    getTotalUsers,
    getGymIdByAdminId,
    createUser,
    updateUser,
    deleteUser,
};
