const express = require('express');
const router = express.Router();
const adminUsersController = require('../controllers/adminUsersController');

// Ruta para obtener usuarios con paginación
router.get('/usuarios', adminUsersController.getPaginatedUsers);

// Ruta para obtener un usuario por ID
router.get('/usuarios/:id', adminUsersController.getUserById);

// Ruta para crear un usuario
router.post('/usuarios', adminUsersController.createUser);

// Ruta para actualizar un usuario
router.patch('/usuarios/:id', adminUsersController.updateUser);

// Ruta para eliminar un usuario
router.delete('/usuarios/:id', adminUsersController.deleteUser);

module.exports = router;
