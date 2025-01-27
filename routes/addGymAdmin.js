//Por revisar (utilidad)

const express = require('express');
const router = express.Router();
const { registerGym } = require('../controllers/addGymAdmin');

// Ruta para registrar un nuevo gimnasio
router.post('/register', registerGym);

module.exports = router;