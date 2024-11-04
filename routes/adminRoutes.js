const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();

// Resumen Financiero
router.get('/estadisticas/financieras', adminController.getFinancialStats);

// Estadísticas de Clientes
router.get('/estadisticas/clientes', adminController.getClientStats);

// Estadísticas de Asistencias
router.get('/estadisticas/asistencias', adminController.getAttendanceStats);

// Alertas y Notificaciones
router.get('/estadisticas/alertas', adminController.getAlerts);

module.exports = router;
