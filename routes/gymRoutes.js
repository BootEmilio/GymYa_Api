const express = require('express');
const gymController = require('../controllers/gymController');
const token = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para crear un gimnasio
router.post('/gimnasios', gymController.crearGimnasio);

// Ruta para editar un gimnasio
router.put('/gimnasios/:id', token, gymController.editarGimnasio);

module.exports = router;