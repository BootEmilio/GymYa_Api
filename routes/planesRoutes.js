const express = require('express');
const planesController = require('../controllers/planesController');
const token = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para crear un plan de membresía
router.post('/planes', token, planesController.crearPlanes);

// Ruta para mostrar planes de membresía
router.get('/planes', token, planesController.mostrarPlanes);

// Ruta para editar un plan de membresía
router.put('/planes/:id', token, planesController.editarPlanes);

// Ruta para "eliminar" un plan de membresía (marcar como inactivo)
router.put('/planes/:id/eliminar', token, planesController.eliminarPlan);

module.exports = router;