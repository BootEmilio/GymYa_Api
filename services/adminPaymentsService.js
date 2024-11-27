const PagosRepository = require('../repositories/adminPaymentsRepository');

class AdminPaymentsService {
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

module.exports = new AdminPaymentsService();
