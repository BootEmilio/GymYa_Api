// models/pagosModel.js
const { Pool } = require('pg');
const pool = require('../db'); // Asegúrate de tener configurada la conexión a la base de datos

class Pago {
    constructor(id_cliente, id_membresia, monto, metodo_pago, estado) {
        this.id_cliente = id_cliente;
        this.id_membresia = id_membresia;
        this.monto = monto;
        this.metodo_pago = metodo_pago;
        this.estado = estado || 'Completado'; // Valor por defecto
    }
}

module.exports = { Pago };
