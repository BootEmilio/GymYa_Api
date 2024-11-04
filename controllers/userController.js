const User = require('../models/userModel');
const userService = require('../services/userService');

exports.crearUsuario = async (req, res) => {
    try {
        const nuevoUsuario = await userService.createUser(req.body);
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
};

exports.obtenerUsuario = async (req, res) => {
    try {
        const usuario = await userService.getUserById(req.params.id);
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
};

// Otros métodos para actualizar y eliminar usuarios
exports.actualizarUsuario = async (req, res) => {
    try {
        const usuarioActualizado = await userService.updateUser(req.params.id, req.body);
        res.json(usuarioActualizado);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
};

exports.eliminarUsuario = async (req, res) => {
    try {
        await userService.deleteUser(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
};
