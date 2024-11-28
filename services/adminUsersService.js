const User = require('../models/userModel');
const userRepository = require('../repositories/adminUsersRepository');

const getPaginatedUsers = async (gym_id, limit, offset) => {
    const data = await userRepository.getPaginatedUsers(gym_id, limit, offset);
    const totalItems = await userRepository.getTotalUsers(gym_id);

    // Calcula el total de páginas
    const totalPages = Math.ceil(totalItems / limit);

    return { data, totalItems, totalPages };
};

const getUserById = async (gym_id, id) => {
    return await userRepository.getUserById(gym_id, id);
};

const createUser = async (userData) => {
    // Validar campos obligatorios
    if (!userData.gym_id || !userData.username || !userData.password) {
        throw new Error('Faltan datos obligatorios: gym_id, username, password');
    }

    const newUser = {
        gym_id: userData.gym_id,
        username: userData.username,
        password: userData.password,
        nombre_completo: userData.nombre_completo || null,
        email: userData.email || null,
        telefono: userData.telefono || null,
        fecha_registro: userData.fecha_registro || new Date() // Usa la fecha actual si no se proporciona
    };

    return await userRepository.createUser(newUser);
};

const updateUser = async (gym_id, id, userData) => {
    // Validar que el ID y el gym_id sean válidos
    if (!id || isNaN(id) || !gym_id || isNaN(gym_id)) {
        throw new Error('El ID proporcionado o el gym_id no son válidos');
    }

    return await userRepository.updateUser(gym_id, id, userData);
};

const deleteUser = async (gym_id, id) => {
    // Validar que el ID y el gym_id sean válidos
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
