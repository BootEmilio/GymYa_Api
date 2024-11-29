const userRepository = require('../repositories/adminUsersRepository');

const getPaginatedUsers = async (adminId, limit, offset) => {
    if (!adminId) {
        throw new Error('El ID del administrador es obligatorio para obtener los usuarios');
    }

    const gymId = await userRepository.getGymIdByAdminId(adminId);
    if (!gymId) {
        throw new Error('No se encontró un gimnasio relacionado con este administrador');
    }

    const data = await userRepository.getPaginatedUsers(gymId, limit, offset);
    const totalItems = await userRepository.getTotalUsers(gymId);
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

const updateUser = async (adminId, userId, userData) => {
    // Obtener el gym_id basado en el ID del administrador
    const gymId = await userRepository.getGymIdByAdminId(adminId);
    if (!gymId) {
        throw new Error('No se encontró un gimnasio asociado al administrador');
    }

    // Llamar al repositorio para actualizar el usuario
    const updatedUser = await userRepository.updateUser(gymId, userId, userData);

    return updatedUser;
};

const deleteUser = async (adminId, userId) => {
    // Obtener el gym_id basado en el ID del administrador
    const gymId = await userRepository.getGymIdByAdminId(adminId);
    if (!gymId) {
        throw new Error('No se encontró un gimnasio asociado al administrador');
    }

    // Llamar al repositorio para eliminar el usuario
    const result = await userRepository.deleteUser(gymId, userId);

    return result;
};

module.exports = {
    getPaginatedUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
