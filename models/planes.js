const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    gym_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    costo: {type: Number, required: true},
    duracion_meses: { type: Number },
    duracion_semanas: { type: Number },
    duracion_dias: { type: Number }, //No son necesarios ya que un plan puede ser mensual, semanal o un día de prueba
    activa: { type: Boolean, default: true }
}, { collection: 'planes' }); // Nombre de la colección en MongoDB

module.exports = mongoose.model('Plan', PlanSchema);