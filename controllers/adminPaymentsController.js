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
        if (isNaN(id)) {
            return res.status(400).json({ error: 'El ID debe ser un número válido' });
        }

        const pago = await PagosService.findPagoById(id);
        if (!pago) {
            return res.status(404).json({ error: 'Pago no encontrado' });
        }

        res.status(200).json(pago);
    } catch (error) {
        console.error('Error al obtener el pago:', error);
        res.status(500).json({ error: 'Error al obtener el pago' });
    }
};

const getPagosByCliente = async (req, res) => {
    try {
        const id_cliente = parseInt(req.params.id_cliente);
        if (isNaN(id_cliente)) {
            return res.status(400).json({ error: 'El ID del cliente debe ser un número válido' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { data, totalItems, totalPages } = await PagosService.findPagosByCliente(id_cliente, limit, offset);

        res.status(200).json({
            currentPage: page,
            totalPages,
            totalItems,
            data,
        });
    } catch (error) {
        console.error('Error al obtener los pagos del cliente:', error);
        res.status(500).json({ error: 'Error al obtener los pagos del cliente' });
    }
};

const getPagosPendientes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { data, totalItems, totalPages } = await PagosService.findPagosPendientes(limit, offset);

        res.status(200).json({
            currentPage: page,
            totalPages,
            totalItems,
            data,
        });
    } catch (error) {
        console.error('Error al obtener pagos pendientes:', error);
        res.status(500).json({ error: 'Error al obtener pagos pendientes' });
    }
};

module.exports = {
    getPagos,
    getPagoById,
    getPagosByCliente,
    getPagosPendientes,
};
