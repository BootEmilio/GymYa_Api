const express = require('express');
const membresiasController = require('../controllers/membresiasController');
const token = require('../middlewares/authMiddleware');
const router = express.Router();

// Ruta para obtener las membresías activas o expiradas
router.get('/:gymId/membresias/:status', token, membresiasController.getMembresias);
// Ruta para obtener las membresía del usuario
router.get('/membresia', token, membresiasController.getMembresia);
// Ruta para aplazar las membresías existentes
router.put('/membresias/:membresia_id', token, membresiasController.aplazarMembresia);
module.exports = router;