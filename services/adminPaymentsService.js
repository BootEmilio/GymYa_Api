const PagosRepository = require('../repositories/adminPaymentsRepository');
const { Pago } = require('../models/pagosModel');

class PagosService {
    async createPago(data) {
        const pago = new Pago(data.id_cliente, data.id_membresia, data.monto, data.metodo_pago, data.estado);
        const result = await PagosRepository.createPago(pago);

        console.log("Pago creado con fecha de pago:", result.fecha_pago); // Registro para depuración
        return result;
    }

    async updatePago(id, data) {
        return await PagosRepository.updatePago(id, data);
    }

    async findPagoById(id) {
        return await PagosRepository.findPagoById(id);
    }

    async findAllPagos(limit, offset) {
        const data = await PagosRepository.findAllPagos(limit, offset);
        const totalItems = await PagosRepository.countAllPagos();
        const totalPages = Math.ceil(totalItems / limit);

        return { data, totalItems, totalPages };
    }

    async findPagosByCliente(id_cliente, limit, offset) {
        const data = await PagosRepository.findPagosByCliente(id_cliente, limit, offset);
        const totalItems = await PagosRepository.countPagosByCliente(id_cliente);
        const totalPages = Math.ceil(totalItems / limit);

        return { data, totalItems, totalPages };
    }

    async findPagosPendientes(limit, offset) {
        try {
            // Obtener los pagos pendientes
            const pagos = await PagosRepository.findPagosPendientes(limit, offset);

            // Contar el número total de pagos pendientes
            const totalItems = await PagosRepository.countPagosPendientes();

            // Calcular el número total de páginas
            const totalPages = Math.ceil(totalItems / limit);

            // Devolver los resultados
            return {
                data: pagos,
                totalItems,
                totalPages
            };
        } catch (error) {
            console.error('Error al obtener pagos pendientes:', error);
            throw new Error('Error al obtener pagos pendientes');
        }
    }
}

module.exports = new PagosService();
