// controllers/userAccessController.js
const userAccessService = require('../services/userAccessService');

const createAcceso = async (req, res) => {
    try {
        const userId = req.user.id; // Obtener el ID del usuario desde el JWT
        const acceso = await userAccessService.createAcceso(userId);
        res.status(201).json({
            message: 'Acceso creado exitosamente',
            acceso,
        });
    } catch (error) {
        console.error('Error al crear el acceso:', error);
        res.status(500).json({ message: 'Error al crear el acceso' });
    }
};

const getAccesos = async (req, res) => {
    try {
        const userId = req.user.id; // Obtener el ID del usuario desde el JWT
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const data = await userAccessService.getAccesosByUserId(userId, limit, offset);
        const totalItems = await userAccessService.getTotalAccesosByUserId(userId);

        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).json({
            currentPage: page,
            totalPages,
            totalItems,
            data,
        });
    } catch (error) {
        console.error('Error al obtener los accesos:', error);
        res.status(500).json({ message: 'Error al obtener los accesos' });
    }
};

module.exports = {
    createAcceso,
    getAccesos,
};
