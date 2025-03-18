const mongoose = require('mongoose');

const AsistenciaSchema = new mongoose.Schema({
    membresia_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Membresias', required: true },
    gym_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Gimnasios', required: true },
    fecha_hora_entrada: { type: Date, required: true},
    fecha_hora_salida: { type: Date},
    salida_registrada: { type: Boolean, default: false } // Para controlar si ya se registró la salida
});

module.exports = mongoose.model('Asistencia', AsistenciaSchema);