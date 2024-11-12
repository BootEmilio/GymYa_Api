const Accesos = require ('../models/accesosModel');
const accesosRepository = require('../repositories/accesosRepository');

const getAllAccesos = async () =>{
    return await accesosRepository.getAllAccesos();
};

const getAccesosById = async () => {
    return await accesosRepository.getAccesosById();
};

module.exports = {
    getAllAccesos,
    getAccesosById
};