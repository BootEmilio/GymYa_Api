const accesosRepository = require('../repositories/adminAccessRepository');

const getPaginatedAccesos = async (limit, offset) => {
    const data = await accesosRepository.getPaginatedAccesos(limit, offset);
    const totalItems = await accesosRepository.getTotalAccesos();

    // Calcula el total de páginas
    const totalPages = Math.ceil(totalItems / limit);

    return { data, totalItems, totalPages };
};

const getAccesosById = async (id) => {
    return await accesosRepository.getAccesosById(id);
};

module.exports = {
    getPaginatedAccesos,
    getAccesosById,
};
