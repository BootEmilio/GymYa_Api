const mongoose = require('mongoose');

const GymSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    telefono: { type: String, required: true },
    horario: { type: String, required: true },
    colaboraciones: { type: Boolean, default: false }
}, { collection: 'gimnasios' }); // Nombre de la colección en MongoDB

module.exports = mongoose.model('Gimnasio', GymSchema);