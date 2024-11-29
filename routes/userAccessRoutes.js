// routes/userAccessRoutes.js
const express = require('express');
const router = express.Router();
const userAccessController = require('../controllers/userAccessController');
const authMiddleware = require('../middlewares/authMiddleware'); // Asegúrate de que este middleware esté importado correctamente

// Ruta para obtener los accesos de un usuario
router.get('/accesos', authMiddleware, userAccessController.getAccesos);

// Ruta para crear un nuevo acceso
router.post('/acceso', authMiddleware, userAccessController.createAcceso);

module.exports = router;
