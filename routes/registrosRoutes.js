const express = require('express');
const adminController  = require('../controllers/adminController');
const entrenadorController = require('../controllers/entrenadoresController');
const router = express.Router();

//ruta para agregar el primer administrador
router.post('/admin/registro', adminController.registro);
//ruta que notifica el pago del administrador
router.post('/admin/pago', adminController.NotificacionPago);
//ruta para agregar el primer administrador
router.post('/entrenador/registro', entrenadorController.registro);

module.exports = router;