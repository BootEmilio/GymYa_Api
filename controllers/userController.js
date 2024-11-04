const userService = require('../services/userService');

const createUser = async (req, res) => {
    try {
        const nuevoUsuario = await userService.createUser(req.body);
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers(); // Llama al servicio para obtener todos los usuarios
        res.status(200).json(users); // Devuelve los usuarios con un código de estado 200
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ error: 'Error al obtener los usuarios' }); // Manejo de errores
    }
  };
  

const getUserById = async (req, res) => {
    try {
        const usuario = await userService.getUserById(req.params.id);
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
};

// Otros métodos para actualizar y eliminar usuarios
const updateUser = async (req, res) => {
    try {
        const usuarioActualizado = await userService.updateUser(req.params.id, req.body);
        res.json(usuarioActualizado);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
};

const deleteUser = async (req, res) => {
    try {
        await userService.deleteUser(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}