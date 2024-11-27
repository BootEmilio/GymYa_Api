const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminRegisterController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', authMiddleware, adminController.registerAdmin);

module.exports = router;