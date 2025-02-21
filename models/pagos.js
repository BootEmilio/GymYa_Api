const mongoose = require('mongoose');

const PagoSchema = new mongoose.Schema({
    membresia_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Mmembresia', required: true },
    gym_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Gimnasio', required: true },
    fecha_hora: { type: Date, default: Date.now},
    concepto: { type: String, required: true },
    monto: { type: Number, required: true },
});

module.exports = mongoose.model('Pago', PagoSchema);