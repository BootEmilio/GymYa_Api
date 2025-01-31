const mongoose = require('mongoose');

const PagoSchema = new mongoose.Schema({
    usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    gym_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', required: true },
    fecha_hora: { type: Date, default: Date.now},
    concepto: { type: String, required: true },
    monto: { type: Float64Array, required: true },
});

module.exports = mongoose.model('Pago', PagoSchema);