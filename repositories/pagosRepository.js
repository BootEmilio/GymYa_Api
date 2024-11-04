// repositories/pagosRepository.js
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

    async findAllPagos() {
        const result = await db.query('SELECT * FROM pagos');
        return result.rows;
    }

    async findPagosByCliente(id_cliente) {
        const result = await db.query('SELECT * FROM pagos WHERE id_cliente = $1', [id_cliente]);
        return result.rows;
    }

    async findPagosPendientes() {
        const result = await db.query('SELECT * FROM pagos WHERE estado = $1', ['Pendiente']);
        return result.rows;
    }
}

module.exports = new PagosRepository();
