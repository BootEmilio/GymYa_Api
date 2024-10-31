// routes/clientRoutes.js
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const loggerMiddleware = require('../middlewares/loggerMiddleware');

router.post('/clientes', loggerMiddleware, clientController.crearCliente);
router.get('/clientes/:id', loggerMiddleware, clientController.obtenerCliente);
router.patch('/clientes/:id', loggerMiddleware, clientController.actualizarCliente);
router.delete('/clientes/:id', loggerMiddleware, clientController.eliminarCliente);

module.exports = router;
