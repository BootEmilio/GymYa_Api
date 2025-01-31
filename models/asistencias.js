const mongoose = require('mongoose');

const AsistenciaSchema = new mongoose.Schema({
    usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    gym_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', required: true },
    fecha_hora: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Asistencia', AsistenciaSchema);