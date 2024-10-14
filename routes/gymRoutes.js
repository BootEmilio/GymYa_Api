const express = require('express');
const gymController = require('../controllers/gymController');
const loggerMiddleware = require('../middlewares/loggerMiddleware'); // Middleware de logs
const router = express.Router();

router.get('/gimnasios', loggerMiddleware, gymController.getAllGyms);
router.get('/gimnasios/:id', loggerMiddleware, gymController.getGymById);
router.post('/gimnasios', loggerMiddleware, gymController.createGym);
router.put('/gimnasios/:id', loggerMiddleware, gymController.updateGym);
router.delete('/gimnasios/:id', loggerMiddleware, gymController.deleteGym);

module.exports = router;
