const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const loggerMiddleware = require('../middlewares/loggerMiddleware'); // Middleware de logs

// Rutas para clientes
router.get('/clientes', loggerMiddleware, clientController.getAllClients);
router.get('/clientes/:id', loggerMiddleware, clientController.getClientById);
router.post('/clientes', loggerMiddleware, clientController.createClient);
router.put('/clientes/:id', loggerMiddleware, clientController.updateClient);
router.delete('/clientes/:id', loggerMiddleware, clientController.deleteClient);

module.exports = router;
