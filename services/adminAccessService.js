const accesosRepository = require('../repositories/adminAccessRepository');

const getPaginatedAccesos = async (gymId, limit, offset) => {
    const data = await accesosRepository.getPaginatedAccesos(gymId, limit, offset);
    const totalItems = await accesosRepository.getTotalAccesos(gymId);

    // Calcula el total de páginas
    const totalPages = Math.ceil(totalItems / limit);

    return { data, totalItems, totalPages };
};

const getAccesosById = async (id, gymId) => {
    return await accesosRepository.getAccesosById(id, gymId);
};

module.exports = {
    getPaginatedAccesos,
    getAccesosById,
};
