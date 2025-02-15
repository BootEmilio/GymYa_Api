const express = require('express');
const entrenadoresController = require('../controllers/entrenadoresController')
const token = require('../middlewares/authMiddleware');
const router = express.Router();

//Ruta para que un administrador agregue a un nuevo entrenador
router.post('/entrenador', token, entrenadoresController.agregarEntrenador);

module.exports = router;