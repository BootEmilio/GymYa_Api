const accesosService = require('../services/accesosService');

const getAllAccesos = async (req, res) => {
    try {
        // Obtén los parámetros de paginación de la consulta (con valores predeterminados)
        const page = parseInt(req.query.page) || 1; // Página predeterminada: 1
        const limit = parseInt(req.query.limit) || 10; // Tamaño de página predeterminado: 10
        const offset = (page - 1) * limit;

        // Llama al servicio para obtener los datos paginados
        const { data, totalItems, totalPages } = await accesosService.getPaginatedAccesos(limit, offset);

        // Devuelve los datos en un formato estándar de paginación
        res.status(200).json({
            currentPage: page,
            totalPages,
            totalItems,
            data,
        });
    } catch (error) {
        console.error('Error al obtener los logs de accesos', error);
        res.status(500).json({ error: 'Error al obtener los logs de accesos' });
    }
};

const getAccesosById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'El ID debe ser un número' });

        const accesos = await accesosService.getAccesosById(id);
        if (!accesos) return res.status(404).json({ error: 'Accesos no encontrado' });

        res.status(200).json(accesos);
    } catch (error) {
        console.error('Error al obtener el accesos solicitado', error);
        res.status(500).json({ error: 'Error al obtener el accesos solicitado' });
    }
};

module.exports = {
    getAllAccesos,
    getAccesosById,
};
