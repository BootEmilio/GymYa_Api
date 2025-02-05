const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    gym_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    costo: {type: Number, required: true},
    duracion_meses: { type: Number, required: true },
    activa: { type: Boolean, default: true }
}, { collection: 'planes' }); // Nombre de la colección en MongoDB

module.exports = mongoose.model('Plan', PlanSchema);