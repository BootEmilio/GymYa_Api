const db = require('../db');

const getAllAccesos = async() =>{
    const result = await db.query('SELECT * FROM accesos_usuarios');
    return result.rows;
};

const getAccesosById = async (id) => {
    const result = await db.query('SELECT * FROM accesos_usuarios WHERE id = $1',[id]);
    return result.rows[0];
};

module.exports ={
    getAccesosById,
    getAllAccesos
};