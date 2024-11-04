const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');
const router = express.Router();

// Resumen Financiero
router.get('/estadisticas/financieras', authMiddleware, adminController.getFinancialStats);

// Estadísticas de Clientes
router.get('/estadisticas/clientes', authMiddleware, adminController.getClientStats);

// Estadísticas de Asistencias
router.get('/estadisticas/asistencias', authMiddleware, adminController.getAttendanceStats);

// Alertas y Notificaciones
router.get('/estadisticas/alertas', authMiddleware, adminController.getAlerts);

module.exports = router;
