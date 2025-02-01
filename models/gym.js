const mongoose = require('mongoose');

const GymSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    telefono: { type: String, required: true },
    administradores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }],
    planes_membresias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plan' }],
}, { collection: 'gimnasios' }); // Nombre de la colección en MongoDB

module.exports = mongoose.model('Gym', GymSchema);