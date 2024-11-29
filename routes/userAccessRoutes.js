const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware de autenticación
const userAccessController = require('../controllers/userAccessController');

// Crear un acceso para el usuario (POST)
router.post('/acceso', authMiddleware, userAccessController.createAcceso);

// Obtener los accesos del usuario autenticado (GET)
router.get('/accesos', authMiddleware, userAccessController.getAccesos);

module.exports = router;
