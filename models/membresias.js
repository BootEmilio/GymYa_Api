const mongoose = require('mongoose');

const MembresiaSchema = new mongoose.Schema({
    gym_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Gimnasio", required: true }],
    plan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    fecha_inicio: { type: Date, required: true },
    fecha_fin: { type: Date, required: true }
}, { collection: 'membresias' }); // Nombre de la colección en MongoDB

module.exports = mongoose.model('Membresia', MembresiaSchema);