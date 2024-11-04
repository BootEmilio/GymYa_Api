const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');
const router = express.Router();

// Resumen Financiero
router.get('/estadisticasfinancieras', authMiddleware, adminController.getFinancialStats);

// Estadísticas de Clientes
router.get('/estadisticasclientes', authMiddleware, adminController.getClientStats);

// Estadísticas de Asistencias
router.get('/estadisticasasistencias', authMiddleware, adminController.getAttendanceStats);

// Alertas y Notificaciones
router.get('/estadisticasalertas', authMiddleware, adminController.getAlerts);

module.exports = router;
