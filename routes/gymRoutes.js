const express = require('express');
const gymController = require('../controllers/gymController');
const token = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para crear primer gimnasio
router.post('/primerGym', gymController.crearGimnasio);

// Ruta para editar un gimnasio
router.put('/gym/:id', token, gymController.editarGimnasio);

// Ruta para crear otro gimnasio
router.post('/addGym', token, gymController.crearGimnasio);

module.exports = router;