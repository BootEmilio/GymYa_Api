const express = require('express');
const gymController = require('../controllers/gymController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Subida temporal a la carpeta 'uploads'
const token = require('../middlewares/authMiddleware');
const router = express.Router();

//Ruta para crear gimnasio
router.post('/gym', token, upload.single('imagen'), gymController.crearGimnasio);
//Ruta para que el admin vea sus gimnasios
router.get('/gym', token, gymController.verGimnasios)
// Ruta para obtener un gimnasio por su ID
router.get("/gym/:gymId", gymController.obtenerGimnasioPorId);
//Ruta para editar un gimnasio
router.put('/:gymId/editar', upload.single('imagen'), token, gymController.editarGimnasio);
//Ruta para que el usuario vea los gimnasios a los que puede acceder con su membresía
router.get('/:membresiaId/gimnasios', token, gymController.verGimnasiosUser);
/*
//Ruta para ver los usuarios activos
router.get('/:gymId/usuariosActivos', token, gymController.contarMembresiasActivas);
*/
module.exports = router;