const express = require('express');
const router = express.Router();
const accesosController = require('../controllers/accesosController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /accesos:
 *   get:
 *     summary: Obtener todos los accesos con paginación
 *     description: Devuelve una lista de accesos con soporte para paginación. Se requiere autenticación mediante token JWT.
 *     tags:
 *       - Accesos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de la página a obtener
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de elementos por página
 *     responses:
 *       200:
 *         description: Lista de accesos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 totalItems:
 *                   type: integer
 *                   example: 50
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID del acceso
 *                       nombre:
 *                         type: string
 *                         description: Nombre del acceso
 *                       descripcion:
 *                         type: string
 *                         description: Descripción del acceso
 *                       fecha_creacion:
 *                         type: string
 *                         format: date-time
 *                         description: Fecha de creación del acceso
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
 *       401:
 *         description: Token inválido o no proporcionado
 *       404:
 *         description: Acceso no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/accesos/:id', authMiddleware, accesosController.getAccesosById);

module.exports = router;
