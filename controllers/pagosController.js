const PagosService = require('../services/pagosService');

class PagosController {
    async addPago(req, res) {
        try {
            const newPago = await PagosService.createPago(req.body);
            res.status(201).json({
                message: 'Pago registrado exitosamente',
                payment: newPago,
            });
        } catch (error) {
            console.error('Error al agregar el pago:', error);
            res.status(500).json({ message: 'Error al registrar el pago' });
        }
    }

    async editPago(req, res) {
        const { id } = req.params;
        try {
            const updatedPago = await PagosService.updatePago(id, req.body);
            if (!updatedPago) {
                return res.status(404).json({ message: 'Pago no encontrado.' });
            }
            res.status(200).json({
                message: 'Pago actualizado exitosamente',
                payment: updatedPago,
            });
        } catch (error) {
            console.error('Error al actualizar el pago:', error);
            res.status(500).json({ message: 'Error al actualizar el pago' });
        }
    }

    async getPago(req, res) {
        const { id } = req.params;
    
        // Validar que el ID sea un número
        if (isNaN(parseInt(id, 10))) {
            return res.status(400).json({ message: 'El ID debe ser un número válido' });
        }
    
        try {
            const pago = await PagosService.findPagoById(parseInt(id, 10));
            if (!pago) {
                return res.status(404).json({ message: 'Pago no encontrado.' });
            }
            res.status(200).json(pago);
        } catch (error) {
            console.error('Error al obtener el pago:', error);
            res.status(500).json({ message: 'Error al obtener el pago' });
        }
    }
    

    async getPagos(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        try {
            const { data, totalItems, totalPages } = await PagosService.findAllPagos(limit, offset);
            res.status(200).json({
                currentPage: page,
                totalPages,
                totalItems,
                data,
            });
        } catch (error) {
            console.error('Error al obtener los pagos:', error);
            res.status(500).json({ message: 'Error al obtener los pagos' });
        }
    }

    async getPagosByCliente(req, res) {
        const { id_cliente } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        try {
            const { data, totalItems, totalPages } = await PagosService.findPagosByCliente(id_cliente, limit, offset);
            res.status(200).json({
                currentPage: page,
                totalPages,
                totalItems,
                data,
            });
        } catch (error) {
            console.error('Error al obtener los pagos del cliente:', error);
            res.status(500).json({ message: 'Error al obtener los pagos del cliente' });
        }
    }

    async getPagosPendientes(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
    
        // Validar que los valores sean números positivos
        if (page < 1 || limit < 1) {
            return res.status(400).json({ message: 'Los valores de paginación deben ser números positivos.' });
        }
    
        const offset = (page - 1) * limit;
    
        try {
            const { data, totalItems, totalPages } = await PagosService.findPagosPendientes(limit, offset);
            res.status(200).json({
                currentPage: page,
                totalPages,
                totalItems,
                data,
            });
        } catch (error) {
            console.error('Error al obtener pagos pendientes:', error);
            res.status(500).json({ message: 'Error al obtener pagos pendientes' });
        }
    }
    
    
}

module.exports = new PagosController();
