const membresiasService = require('../services/membresiasService');

const getMembresias = async (req, res) => {
    try{
        const { gymId, status } = req.params;

        // Validar si el status es "activas" o "expiradas"
        if (status !== 'activas' && status !== 'expiradas') {
            return res.status(400).json({ error: 'Estado inválido. Use "activas" o "expiradas".' });
        }

        // Llamar al servicio para obtener las membresías
        const membresias = await membresiasService.getMembresias(gymId, status);

        // Devolver los resultados como respuesta
        res.status(200).json(membresias);
    } catch (error){
        console.error('Error en obtenerMembresias:', error);
        res.status(500).json({ error: 'Ocurrió un error al obtener las membresías.' });
    }
};

module.exports = { getMembresias };