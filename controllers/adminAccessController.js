const accesosService = require('../services/adminAccessService');

const getAllAccesos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { data, totalItems, totalPages } = await accesosService.getPaginatedAccesos(limit, offset);

        res.status(200).json({
            currentPage: page,
            totalPages,
            totalItems,
            data,
        });
    } catch (error) {
        console.error('Error al obtener los accesos:', error);
        res.status(500).json({ error: 'Error al obtener los accesos' });
    }
};

const getAccesosById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'El ID debe ser un número' });

        const acceso = await accesosService.getAccesosById(id);
        if (!acceso) return res.status(404).json({ error: 'Acceso no encontrado' });

        res.status(200).json(acceso);
    } catch (error) {
        console.error('Error al obtener el acceso:', error);
        res.status(500).json({ error: 'Error al obtener el acceso' });
    }
};

module.exports = { getAllAccesos, getAccesosById };
