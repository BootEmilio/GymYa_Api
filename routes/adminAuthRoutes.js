const express = require('express');
const AuthAdminController  = require('../controllers/adminAuthController');
const router = express.Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Permite a un usuario autenticarse en la aplicación
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre de usuario del cliente
 *               password:
 *                 type: string
 *                 description: Contraseña del cliente
 *             required:
 *               - username
 *               - password
 *             example:
 *               username: "cperez"
 *               password: "12345"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticación
 *               example:
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', AuthAdminController.loginAdmin);

module.exports = router;
