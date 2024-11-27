const PagosService = require('../services/adminPaymentsService');

const getPagos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { data, totalItems, totalPages } = await PagosService.findAllPagos(limit, offset);

        res.status(200).json({
            currentPage: page,
            totalPages,
            totalItems,
            data,
        });
    } catch (error) {
        console.error('Error al obtener los pagos:', error);
        res.status(500).json({ error: 'Error al obtener los pagos' });
    }
};

const getPagoById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'El ID debe ser un número válido' });

        const pago = await PagosService.findPagoById(id);
        if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });

        res.status(200).json(pago);
    } catch (error) {
        console.error('Error al obtener el pago:', error);
        res.status(500).json({ error: 'Error al obtener el pago' });
    }
};

module.exports = { getPagos, getPagoById };
