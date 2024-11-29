const userService = require('../services/adminUsersService');

const getPaginatedUsers = async (req, res) => {
    try {
        const gym_id = req.user.gym_id; // Extrae el gym_id del token JWT
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { data, totalItems, totalPages } = await userService.getPaginatedUsers(gym_id, limit, offset);

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
        console.log('Cuerpo de la solicitud:', req.body); // Depurar el cuerpo recibido
        const gym_id = req.user.gym_id;
        console.log('Gym ID:', gym_id); // Depurar gym_id extraído del token
        const userData = { ...req.body, gym_id };
        const newUser = await userService.createUser(userData);

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error al crear el usuario:', error.message);
        res.status(500).json({ error: error.message });
    }
};


const updateUser = async (req, res) => {
    try {
        const gym_id = req.user.gym_id; // Extrae el gym_id del token JWT
        const updatedUser = await userService.updateUser(gym_id, req.params.id, req.body);

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ error: 'Error al actualizar el usuario' });
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
