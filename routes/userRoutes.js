const express = require('express');
const userController = require('../controllers/userController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Subida temporal a la carpeta 'uploads'
const token = require('../middlewares/authMiddleware');
const router = express.Router();

// Ruta para actualizar número o imagen del usuario
router.put('/:usuarioId/actualizarUsuario', upload.single('imagen'), token, userController.editarUsuario);

module.exports = router;