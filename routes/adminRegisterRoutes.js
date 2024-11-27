const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminRegisterController');

router.post('/register', adminController.registerAdmin);

module.exports = router;