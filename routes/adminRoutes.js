const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const loggerMiddleware = require('../middlewares/loggerMiddleware');

// Rutas de estadísticas
router.get('/estadisticas/financieras', loggerMiddleware, adminController.getFinancialStats);
router.get('/estadisticas/clientes', loggerMiddleware, adminController.getClientStats);
router.get('/estadisticas/asistencias', loggerMiddleware, adminController.getAttendanceStats);
router.get('/estadisticas/alertas', loggerMiddleware, adminController.getAlerts);

module.exports = router;
