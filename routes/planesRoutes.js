const express = require('express');
const planesController = require('../controllers/planesController');
const token = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para crear un plan de membresía
router.post('/planes', token, planesController.crearPlanes);

// Ruta para mostrar planes de membresía (con filtro opcional de costo)
router.get('/planes', token, planesController.mostrarPlanes);

// Ruta para editar un plan de membresía
router.put('/planes/:id', token, planesController.editarPlanes);

module.exports = router;