const express = require('express');
const membresiasController = require('../controllers/membresiasController');
const token = require('../middlewares/authMiddleware');
const router = express.Router();

// Ruta para registrar usuarios junto a sus membresías
router.post('/membresias/:gymId', token, membresiasController.registroUsuario);
// Ruta para obtener las membresías activas o expiradas
router.get('/membresias/:gymId/:status', token, membresiasController.getMembresias);
// Ruta para aplazar las membresías existentes
router.put('/membresias/:membresia_id', token, membresiasController.aplazarMembresia);
module.exports = router;