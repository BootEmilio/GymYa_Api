const express = require('express');
const membresiasController = require('../controllers/membresiasController');
const token = require('../middlewares/authMiddleware');
const router = express.Router();

// Ruta para registrar usuarios junto a sus membresías
router.post('/user/registro', token, membresiasController.registroUsuario);
// Ruta para agregar membresía a un usuario ya registrado
router.post('/nuevaMembresia', token, membresiasController.crearMembresia);
// Ruta para obtener las membresías activas o expiradas de un gimnasio
router.get('/:gymId/membresias/:status', token, membresiasController.getMembresias);
// Ruta para obtener las membresías del usuario
router.get('/membresias', token, membresiasController.getMembresiasUser);
// Ruta para obtener una membresía del usuario
router.get('/:membresiaId', token, membresiasController.getMembresia);
// Ruta para obtener el número de todas las membresías activas
router.get('/membresias/count', membresiasController.getMembresiasCount);
// Ruta para obtener el número de todas las membresías registradas
router.get('/membresias/total', membresiasController.getTotalMembresias);
// Ruta para aplazar las membresías existentes
router.put('/:membresiaId/aplazar', token, membresiasController.aplazarMembresiaVentanilla);
// Ruta para aplazar las membresía desde la app móvil (pendiente)
router.put('/:membresiaId/aplazarOnline', token, membresiasController.aplazarMembresiaOnline);
// Ruta que notifica el pago del usuario (pendiente)
router.post('/usuario/pago', membresiasController.NotificarPago);
module.exports = router;