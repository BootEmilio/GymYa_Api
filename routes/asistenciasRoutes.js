const express = require('express');
const asistenciasController = require('../controllers/asistenciasController');
const token = require('../middlewares/authMiddleware');
const router = express.Router();

//Ruta para registrar entradas y salidas (pronto cambiar a QR)
router.post('/nuevaAsistencia', token, asistenciasController.registrarAsistencia);
//Ruta para ver las entradas y salidas del gimnasio
router.get('/asistencias', token, asistenciasController.verAsistencias);
//Ruta para ver las entradas y salidas de un usuario
router.get('/asistenciasUser', token, asistenciasController.verAsistenciasUser);
// Ruta para registrar una nueva asistencia
//router.post('/asistencias', token, asistenciasController.createAsistencia);

// Ruta para obtener el historial de asistencias de un usuario
//router.get('/asistencias', token, asistenciasController.getAsistencias);

module.exports = router;
