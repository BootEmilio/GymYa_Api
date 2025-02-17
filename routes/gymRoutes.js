const express = require('express');
const gymController = require('../controllers/gymController');
const token = require('../middlewares/authMiddleware');
const router = express.Router();

//Ruta para crear gimnasio
router.create('/gym', token, gymController.crearGimnasio);
//Ruta para ver gimnasios
router.get('/gym', token, gymController.verGimnasios)
// Ruta para editar un gimnasio
router.put('/:gymId/editar', token, gymController.editarGimnasio);

module.exports = router;