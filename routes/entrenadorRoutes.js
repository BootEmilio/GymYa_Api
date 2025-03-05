const express = require('express');
const entrenadoresController = require('../controllers/entrenadoresController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Subida temporal a la carpeta 'uploads'
const token = require('../middlewares/authMiddleware');
const router = express.Router();

//Ruta para que un administrador agregue a un nuevo entrenador
router.post('/:gymId/agregarEntrenador', upload.single('imagen'), token, entrenadoresController.agregarEntrenador);
//Ruta para ver los entrenadores del gimnasio
router.get('/:gymId/entrenadores', token, entrenadoresController.verEntrenadores);
//Ruta para ver un entrenador en web o app móvil
router.get('/:entrenadorId/entrenador', token, entrenadoresController.verEntrenador);
//Ruta para ver los entrenadores disponibles con la membresia
//router.get('/:membresiaId/verEntrenadores', token, entrenadoresController.verEntrenadoresUser);
//Ruta para editar un entrenador desde web
//router.put('/:entrenadorId/editarEntrenador', upload.single('imagen'), token, entrenadoresController.editarEntrenador);
//Ruta para eliminar un entrenador desde web
//router.delete('/:entrenadorId/eliminarEntrenador', token, entrenadoresController.eliminarEntrenador);

module.exports = router;