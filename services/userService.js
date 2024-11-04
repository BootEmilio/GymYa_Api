const User = require('../models/userModel');
const userRepository = require('../repositories/userRepository');

const getAllUsers = async () => {
    return await userRepository.getAllUsers();
};

const getUserById = async (id) => {
    return await userRepository.getUserById(id);
};

const createUser = async (userData) => {
    const newUser = new User(
        null,  // id se generará automáticamente en la BD
        userData.nombre_completo,
        userData.fecha_registro,
        userData.telefono,
        userData.activo,
        userData.username,
        userData.password // Recuerda que aquí podrías aplicar un hash si es necesario
    );
    return await userRepository.createUser(newUser);
};

const updateUser = async (id, userData) => {
    return await userRepository.updateUser(id, userData);
};

const deleteUser = async (id) => {
    return await userRepository.deleteUser(id);
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};