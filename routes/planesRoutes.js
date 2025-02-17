const express = require('express');
const planesController = require('../controllers/planesController');
const token = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para crear un plan de membresía
router.post('/:gymId/planes', token, planesController.crearPlanes);

// Ruta para mostrar planes de membresía
router.get('/:gymId/planes', token, planesController.mostrarPlanes);

// Ruta para editar un plan de membresía
router.put('/:gymId/planes/:planId', token, planesController.editarPlanes);

// Ruta para "eliminar" un plan de membresía (marcar como inactivo)
router.put('/:gym_id/planes/:id/eliminar', token, planesController.eliminarPlan);

module.exports = router;