const express = require('express');
const router = express.Router();
const accesosController = require('../controllers/accesosController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/accesos', authMiddleware, accesosController.getAllAccesos);
router.get('/accesos/:id', authMiddleware, accesosController.getAccesosById);

module.exports = router;