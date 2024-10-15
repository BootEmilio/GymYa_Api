/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión en la API
 *     tags: 
 *       - Autenticación
 *     description: Inicia sesión y obtiene un token de autenticación JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre de usuario
 *                 example: "usuario123"
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso. Retorna un token JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticación
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Credenciales inválidas"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error interno del servidor"
 */

const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/login', authController.login);

module.exports = router;