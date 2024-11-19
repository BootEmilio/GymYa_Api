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
        // Obtén los parámetros de paginación de la consulta (con valores predeterminados)
        const page = parseInt(req.query.page) || 1; // Página predeterminada: 1
        const limit = parseInt(req.query.limit) || 10; // Tamaño de página predeterminado: 10
        const offset = (page - 1) * limit;

        // Llama al servicio para obtener los datos paginados
        const { data, totalItems, totalPages } = await userService.getAllUsers(limit, offset);

        // Devuelve los datos en un formato estándar de paginación
        res.status(200).json({
            currentPage: page,
            totalPages,
            totalItems,
            data,
        });
    } catch (error) {
        console.error('Error al obtener los logs de los usuarios', error);
        res.status(500).json({ error: 'Error al obtener los logs de usuarios' });
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