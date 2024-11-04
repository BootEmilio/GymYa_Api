// services/pagosService.js
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

    async findAllPagos() {
        return await PagosRepository.findAllPagos();
    }

    async findPagosByCliente(id_cliente) {
        return await PagosRepository.findPagosByCliente(id_cliente);
    }

    async findPagosPendientes() {
        return await PagosRepository.findPagosPendientes();
    }
}

module.exports = new PagosService();
