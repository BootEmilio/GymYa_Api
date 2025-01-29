const db = require('../db');
require('dotenv').config();

//Servicio para obtener todas las membresías activas de un gimnasio
const getActivas = async (gymId) => {
    try{
        let query = "SELECT * FROM membresias_activas($1);"
        const values = [gymId];

        const result = await db.query(query, values);
        return result.rows;
    }catch (error){
        console.error('Error al mostrar las membresías activas:', error);
        throw new Error('Error al mostrar las membresías activas');
    }
};

//Servicio para obtener todas las membresías activas de un gimnasio
const getDesactivadas = async (gymId) => {
    try{
        let query = "SELECT * FROM membresias_desactivadas($1);"
        const values = [gymId];

        const result = await db.query(query, values);
        return result.rows;
    }catch (error){
        console.error('Error al mostrar las membresías desactivadas:', error);
        throw new Error('Error al mostrar las membresías desactivadas');
    }
};

//Servicio para aplazar fecha_fin

module.exports = { getActivas, getDesactivadas };