const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    gym_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    costo: {type: Float64Array, required: true},
    duracion_meses: { type: Int32Array, required: true }
});

module.exports = mongoose.model('Plan', PlanSchema);