// controllers/pagosController.js
const PagosService = require('../services/pagosService');

class PagosController {
    async addPago(req, res) {
        try {
            const newPago = await PagosService.createPago(req.body);
            res.status(201).json({
                message: 'Pago registrado exitosamente',
                payment: newPago
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
                payment: updatedPago
            });
        } catch (error) {
            console.error('Error al actualizar el pago:', error);
            res.status(500).json({ message: 'Error al actualizar el pago' });
        }
    }

    async getPago(req, res) {
        const { id } = req.params;
        try {
            const pago = await PagosService.findPagoById(id);
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
        try {
            const pagos = await PagosService.findAllPagos();
            res.status(200).json(pagos);
        } catch (error) {
            console.error('Error al obtener los pagos:', error);
            res.status(500).json({ message: 'Error al obtener los pagos' });
        }
    }

    async getPagosByCliente(req, res) {
        const { id_cliente } = req.params;
        try {
            const pagos = await PagosService.findPagosByCliente(id_cliente);
            res.status(200).json(pagos);
        } catch (error) {
            console.error('Error al obtener los pagos del cliente:', error);
            res.status(500).json({ message: 'Error al obtener los pagos del cliente' });
        }
    }

    async getPagosPendientes(req, res) {
        try {
            const pagosPendientes = await PagosService.findPagosPendientes();
            res.status(200).json(pagosPendientes);
        } catch (error) {
            console.error('Error al obtener pagos pendientes:', error);
            res.status(500).json({ message: 'Error al obtener pagos pendientes' });
        }
    }
}

module.exports = new PagosController();
