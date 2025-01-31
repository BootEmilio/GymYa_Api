const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    gym_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    nombre_completo: { type: String, required: true },
    email: { type: String, required: true },
    telefono: { type: String, required: true },
    imagen: { type: String, default: 'User.jpg' }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);