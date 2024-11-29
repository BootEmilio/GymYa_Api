const express = require('express');
const router = express.Router();
const userAttendanceController = require('../controllers/userAttendanceController');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware para verificar autenticación

// Ruta para registrar una nueva asistencia
router.post('/asistencias', authMiddleware, userAttendanceController.createAsistencia);

// Ruta para obtener el historial de asistencias de un usuario
router.get('/asistencias', authMiddleware, userAttendanceController.getAsistencias);

module.exports = router;
