const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    membresia_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'membresia', required: true }],
    nombre_completo: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    telefono: { type: String },
    imagen: { type: String, default: 'User.jpg' }
}, { collection: 'usuarios' }); // Nombre de la colección en MongoDB;;

module.exports = mongoose.model('Usuario', UsuarioSchema);