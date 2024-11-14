const express = require('express');
const router = express.Router();
const accesosController = require('../controllers/accesosController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /accesos:
 *   get:
 *     summary: Obtener todos los accesos
 *     description: Devuelve una lista de todos los accesos. Se requiere autenticación mediante token JWT.
 *     tags:
 *       - Accesos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de accesos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID del acceso
 *                   nombre:
 *                     type: string
 *                     description: Nombre del acceso
 *                   descripcion:
 *                     type: string
 *                     description: Descripción del acceso
 *                   fecha_creacion:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha de creación del acceso
 *                 example:
 *                   id: 1
 *                   nombre: "Acceso Principal"
 *                   descripcion: "Permite acceso principal a la aplicación"
 *                   fecha_creacion: "2024-10-30T12:34:56Z"
 *       401:
 *         description: Token inválido o no proporcionado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/accesos', authMiddleware, accesosController.getAllAccesos);

/**
 * @swagger
 * /accesos/{id}:
 *   get:
 *     summary: Obtener un acceso específico por ID
 *     description: Devuelve información detallada de un acceso específico. Se requiere autenticación mediante token JWT.
 *     tags:
 *       - Accesos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del acceso a obtener
 *     responses:
 *       200:
 *         description: Información del acceso obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID del acceso
 *                 nombre:
 *                   type: string
 *                   description: Nombre del acceso
 *                 descripcion:
 *                   type: string
 *                   description: Descripción del acceso
 *                 fecha_creacion:
 *                   type: string
 *                   format: date-time
 *                   description: Fecha de creación del acceso
 *               example:
 *                 id: 1
 *                 nombre: "Acceso Principal"
 *                 descripcion: "Permite acceso principal a la aplicación"
 *                 fecha_creacion: "2024-10-30T12:34:56Z"
 *       401:
 *         description: Token inválido o no proporcionado
 *       404:
 *         description: Acceso no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/accesos/:id', authMiddleware, accesosController.getAccesosById);

module.exports = router;
