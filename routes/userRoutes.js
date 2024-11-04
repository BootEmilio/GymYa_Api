const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const loggerMiddleware = require('../middlewares/loggerMiddleware');

router.post('/usuarios', loggerMiddleware, userController.crearUsuario);
router.get('/usuarios/:id', loggerMiddleware, userController.obtenerUsuario);
router.patch('/usuarios/:id', loggerMiddleware, userController.actualizarUsuario);
router.delete('/usuarios/:id', loggerMiddleware, userController.eliminarUsuario);

module.exports = router;
