const mongoose = require('mongoose');

const EntrenadorSchema = new mongoose.Schema({
    gym_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gimnasio' }], //Los entrenadores independientes no estarán vinculados a ningún gimnasio
    nombre_completo: { type: String, required: true },
    especialidad: { type: String, required: true },
    horario: { type: String }, //Horario de los entrenadores dentro del gimnasio
    independiente: { type: Boolean, required: true, default: false }, //Validaremos que el entrenador sea independiente o no
    email: { type: String },
    password: { type: String },
    imagen: { type: String, required: true }
}, { collection: 'entrenadores' });

module.exports = mongoose.model('Entrenador', EntrenadorSchema);