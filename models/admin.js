const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    gym_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    nombre_completo: { type: String, required: true },
    email: { type: String, required: true },
    telefono: { type: String, required: true }
}, { collection: 'administradores' }); // Nombre de la colección en MongoDB

module.exports = mongoose.model('Administrador', AdminSchema); // Nombre del modelo