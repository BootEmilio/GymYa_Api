const express = require('express');
const gymController = require('../controllers/gymController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Subida temporal a la carpeta 'uploads'
const token = require('../middlewares/authMiddleware');
const router = express.Router();

//Ruta para crear gimnasio
router.post('/gym', token, upload.single('imagen'), gymController.crearGimnasio);
//Ruta para ver gimnasios
router.get('/gym', token, gymController.verGimnasios)
// Ruta para editar un gimnasio
router.put('/:gymId/editar', token, gymController.editarGimnasio);

module.exports = router;