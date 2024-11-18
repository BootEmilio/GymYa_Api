const db = require('../db'); // Asegúrate de tener configurada la conexión a la base de datos

class PagosRepository {
    async createPago(pago) {
        const result = await db.query(
            'INSERT INTO pagos (id_cliente, id_membresia, monto, metodo_pago, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [pago.id_cliente, pago.id_membresia, pago.monto, pago.metodo_pago, pago.estado]
        );
        return result.rows[0];
    }

    async updatePago(id, updateData) {
        const fields = Object.keys(updateData).map((key, index) => `${key} = $${index + 1}`);
        const values = Object.values(updateData);
        values.push(id); // Agregar ID al final para la cláusula WHERE

        const result = await db.query(
            `UPDATE pagos SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING *`,
            values
        );
        return result.rows[0];
    }

    async findPagoById(id) {
        const result = await db.query('SELECT * FROM pagos WHERE id = $1', [id]);
        return result.rows[0];
    }

    async findAllPagos(limit, offset) {
        const result = await db.query(
            'SELECT * FROM pagos ORDER BY fecha_pago DESC LIMIT $1 OFFSET $2',
            [limit, offset]
        );
        return result.rows;
    }

    async countAllPagos() {
        const result = await db.query('SELECT COUNT(*) FROM pagos');
        return parseInt(result.rows[0].count, 10);
    }

    async findPagosByCliente(id_cliente, limit, offset) {
        const result = await db.query(
            'SELECT * FROM pagos WHERE id_cliente = $1 ORDER BY fecha_pago DESC LIMIT $2 OFFSET $3',
            [id_cliente, limit, offset]
        );
        return result.rows;
    }

    async countPagosByCliente(id_cliente) {
        const result = await db.query(
            'SELECT COUNT(*) FROM pagos WHERE id_cliente = $1',
            [id_cliente]
        );
        return parseInt(result.rows[0].count, 10);
    }

    async findPagosPendientes(limit, offset) {
        const result = await db.query(
            'SELECT * FROM pagos WHERE estado = $1 ORDER BY fecha_pago DESC LIMIT $2 OFFSET $3',
            ['Pendiente', limit, offset]
        );
        return result.rows;
    }

    async countPagosPendientes() {
        const result = await db.query(
            'SELECT COUNT(*) FROM pagos WHERE estado = $1',
            ['Pendiente']
        );
        return parseInt(result.rows[0].count, 10);
    }
}

module.exports = new PagosRepository();
