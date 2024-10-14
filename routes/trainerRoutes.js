const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const loggerMiddleware = require('../middlewares/loggerMiddleware');

router.get('/entrenadores', loggerMiddleware, trainerController.getAllTrainers);
router.get('/entrenadores/:id',loggerMiddleware, trainerController.getTrainerById);
router.post('/entrenadores', loggerMiddleware, trainerController.createTrainer);
router.put('/entrenadores/:id', loggerMiddleware, trainerController.updateTrainer);
router.delete('/entrenadores/:id', loggerMiddleware, trainerController.deleteTrainer);

module.exports = router;
