const db = require('../db');

class AdminPaymentsRepository {
    async findPagoById(id) {
        const result = await db.query('SELECT * FROM pagos WHERE id = $1', [id]);
        return result.rows[0];
    }

    async findAllPagos(limit, offset) {
        const result = await db.query('SELECT * FROM pagos ORDER BY fecha_pago DESC LIMIT $1 OFFSET $2', [limit, offset]);
        return result.rows;
    }

    async countAllPagos() {
        const result = await db.query('SELECT COUNT(*) AS total FROM pagos');
        return parseInt(result.rows[0].total, 10);
    }

    async findPagosByCliente(id_cliente, limit, offset) {
        const result = await db.query(
            'SELECT * FROM pagos WHERE id_cliente = $1 ORDER BY fecha_pago DESC LIMIT $2 OFFSET $3',
            [id_cliente, limit, offset]
        );
        return result.rows;
    }

    async countPagosByCliente(id_cliente) {
        const result = await db.query('SELECT COUNT(*) AS total FROM pagos WHERE id_cliente = $1', [id_cliente]);
        return parseInt(result.rows[0].total, 10);
    }

    async findPagosPendientes(limit, offset) {
        const result = await db.query(
            'SELECT * FROM pagos WHERE estado = $1 ORDER BY fecha_pago DESC LIMIT $2 OFFSET $3',
            ['Pendiente', limit, offset]
        );
        return result.rows;
    }

    async countPagosPendientes() {
        const result = await db.query('SELECT COUNT(*) AS total FROM pagos WHERE estado = $1', ['Pendiente']);
        return parseInt(result.rows[0].total, 10);
    }
}

module.exports = new AdminPaymentsRepository();
