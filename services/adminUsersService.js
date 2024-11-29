const userRepository = require('../repositories/adminUsersRepository');

const getPaginatedUsers = async (gym_id, limit, offset) => {
    if (!gym_id) {
        throw new Error('El gym_id es obligatorio para obtener los usuarios');
    }

    const data = await userRepository.getPaginatedUsers(gym_id, limit, offset);
    const totalItems = await userRepository.getTotalUsers(gym_id);

    const totalPages = Math.ceil(totalItems / limit);

    return { data, totalItems, totalPages };
};

const getUserById = async (gym_id, id) => {
    return await userRepository.getUserById(gym_id, id);
};

const createUser = async (adminId, userData) => {
    // Validar campos obligatorios
    if (!userData.username || !userData.password) {
        throw new Error('Faltan datos obligatorios: username, password');
    }

    // Llama al repositorio para crear el usuario
    return await userRepository.createUser(adminId, {
        username: userData.username,
        password: userData.password,
        nombre_completo: userData.nombre_completo || null,
        email: userData.email || null,
        telefono: userData.telefono || null,
        fecha_registro: userData.fecha_registro || new Date().toISOString(),
    });
};

const updateUser = async (gym_id, id, userData) => {
    if (!id || isNaN(id) || !gym_id || isNaN(gym_id)) {
        throw new Error('El ID proporcionado o el gym_id no son válidos');
    }

    return await userRepository.updateUser(gym_id, id, userData);
};

const deleteUser = async (gym_id, id) => {
    if (!id || isNaN(id) || !gym_id || isNaN(gym_id)) {
        throw new Error('El ID proporcionado o el gym_id no son válidos');
    }

    return await userRepository.deleteUser(gym_id, id);
};

module.exports = {
    getPaginatedUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
