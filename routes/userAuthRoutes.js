const express = require('express');
const router = express.Router();
const AuthUserController = require('../controllers/userAuthController');

router.post('/login', AuthUserController.loginUser);

module.exports = router;
