const userService = require('../services/adminUsersService');

const getPaginatedUsers = async (req, res) => {
    try {
        const adminId = req.user.id; // Extrae el ID del administrador autenticado
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { data, totalItems, totalPages } = await userService.getPaginatedUsers(adminId, limit, offset);

        res.status(200).json({
            currentPage: page,
            totalPages,
            totalItems,
            data,
        });
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getUserById = async (req, res) => {
    try {
        const gym_id = req.user.gym_id; // Extrae el gym_id del token JWT
        const user = await userService.getUserById(gym_id, req.params.id);

        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
};

const createUser = async (req, res) => {
    try {
        const adminId = req.user.id; // Extraer adminId del token JWT
        const newUser = await userService.createUser(adminId, req.body);

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error al crear el usuario:', error.message);
        res.status(500).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        // Obtén el ID del administrador desde el token
        const adminId = req.user.id;
        const userId = req.params.id;  // El ID del usuario que se quiere actualizar

        // Validar que el ID del usuario es válido (puedes agregar más validaciones si lo deseas)
        if (!userId || isNaN(userId)) {
            return res.status(400).json({ error: 'El ID del usuario no es válido' });
        }

        // Datos del usuario a actualizar desde el cuerpo de la solicitud
        const userData = req.body;

        // Actualiza el usuario llamando al servicio
        const updatedUser = await userService.updateUser(adminId, userId, userData);

        // Si no se encuentra el usuario, retorna un error
        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Responde con el usuario actualizado
        res.status(200).json(updatedUser);

    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const gym_id = req.user.gym_id; // Extrae el gym_id del token JWT
        await userService.deleteUser(gym_id, req.params.id);

        res.status(204).end();
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
};

module.exports = {
    getPaginatedUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
