// routes/pagosRoutes.js
const express = require('express');
const router = express.Router();
const PagosController = require('../controllers/pagosController');
const loggerMiddleware = require('../middlewares/loggerMiddleware');

// Listar todos los pagos
router.get('/pagos', loggerMiddleware, PagosController.getPagos);

// Obtener un pago por ID
router.get('/pagos/:id', loggerMiddleware, PagosController.getPago);

// Registrar un nuevo pago
router.post('/pagos', loggerMiddleware, PagosController.addPago);

// Obtener todos los pagos realizados por un cliente específico
router.get('/pagos/clientes/:id_cliente', loggerMiddleware, PagosController.getPagosByCliente);

// Listar pagos con estado 'Pendiente'
router.get('/pagos/pendientes', loggerMiddleware, PagosController.getPagosPendientes);

// Actualizar el estado de un pago
router.patch('/pagos/:id', loggerMiddleware, PagosController.editPago);

module.exports = router;
