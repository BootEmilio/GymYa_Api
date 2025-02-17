const express = require('express');
const adminController  = require('../controllers/adminController');
const userController = require('../controllers/userController');
const entrenadorController = require('../controllers/entrenadoresController');
const router = express.Router();

//ruta para logear administrador
router.post('/admin/login', adminController.loginAdmin);
//Login de usuarios
router.post('/user/login', userController.loginUser);
//Login de entrenadores
router.post('/entrenador/login', entrenadorController.login);

module.exports = router;