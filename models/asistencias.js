const mongoose = require('mongoose');

const AsistenciaSchema = new mongoose.Schema({
    membresia_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Membresias', required: true },
    gym_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Gimnasios', required: true },
    tipo_acceso: { type: String, required: true },
    fecha_hora: { type: Date, required: true},
    salida_registrada: { type: Boolean, default: false } // Para controlar si ya se registró la salida
});

module.exports = mongoose.model('Asistencia', AsistenciaSchema);