const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/usuarios', authMiddleware, userController.getAllUsers);
router.get('/usuarios/:id', authMiddleware, userController.getUserById);
router.post('/usuarios', authMiddleware, userController.createUser);
router.patch('/usuarios/:id', authMiddleware, userController.updateUser);
router.delete('/usuarios/:id', authMiddleware, userController.deleteUser);

module.exports = router;