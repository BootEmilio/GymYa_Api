const express = require('express');
const adminController  = require('../controllers/adminController');
const membresiasController = require('../controllers/membresiasController');
const entrenadorController = require('../controllers/entrenadoresController');
const router = express.Router();

//ruta para agregar el primer administrador
router.post('/admin/registro', adminController.registro);
// Ruta para registrar usuarios junto a sus membresías
router.post('/user/registro', token, membresiasController.registroUsuario);
//ruta para agregar el primer administrador
router.post('/entrenador/registro', entrenadorController.registro);

module.exports = router;