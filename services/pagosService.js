const PagosRepository = require('../repositories/pagosRepository');
const { Pago } = require('../models/pagosModel');

class PagosService {
    async createPago(data) {
        const pago = new Pago(data.id_cliente, data.id_membresia, data.monto, data.metodo_pago, data.estado);
        return await PagosRepository.createPago(pago);
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
        const data = await PagosRepository.findPagosPendientes(limit, offset);
        const totalItems = await PagosRepository.countPagosPendientes();
        const totalPages = Math.ceil(totalItems / limit);

        return { data, totalItems, totalPages };
    }
}

module.exports = new PagosService();
