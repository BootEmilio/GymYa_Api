const express = require('express');
const gymController = require('../controllers/gymController');
const token = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para editar un gimnasio
router.put('/gym/:id', token, gymController.editarGimnasio);

// Ruta para crear un gimnasio 
router.post('/addGym', token, gymController.crearGimnasio); //Revisar lógica de este

module.exports = router;