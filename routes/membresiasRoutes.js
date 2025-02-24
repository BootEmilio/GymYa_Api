const express = require('express');
const membresiasController = require('../controllers/membresiasController');
const token = require('../middlewares/authMiddleware');
const router = express.Router();

// Ruta para registrar usuarios junto a sus membresías
router.post('/user/registro', token, membresiasController.registroUsuario);
// Ruta para obtener las membresías activas o expiradas de un gimnasio
router.get('/:gymId/membresias/:status', token, membresiasController.getMembresias);
// Ruta para obtener las membresías del usuario
router.get('/membresias', token, membresiasController.getMembresiasUser);
// Ruta para obtener una membresía del usuario
router.get('/:membresiaId', token, membresiasController.getMembresia);
// Ruta para aplazar las membresías existentes
router.put('/:membresiaId/aplazar', token, membresiasController.aplazarMembresia);
module.exports = router;