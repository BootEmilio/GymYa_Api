const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const loggerMiddleware = require('../middlewares/loggerMiddleware');

router.get('/usuarios', loggerMiddleware, userController.getAllUsers);
router.get('/usuarios/:id', loggerMiddleware, userController.getUserById);
router.post('/usuarios', loggerMiddleware, userController.createUser);
router.patch('/usuarios/:id', loggerMiddleware, userController.updateUser);
router.delete('/usuarios/:id', loggerMiddleware, userController.deleteUser);

module.exports = router;
