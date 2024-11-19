const express = require('express');
const router = express.Router();
const PagosController = require('../controllers/pagosController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /pagos:
 *   get:
 *     summary: Listar todos los pagos
 *     description: Retorna una lista de todos los pagos registrados en el sistema con soporte para paginación.
 *     tags:
 *       - Pagos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de la página a obtener.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de elementos por página.
 *     responses:
 *       200:
 *         description: Lista de pagos obtenida exitosamente.
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
 *                     $ref: '#/components/schemas/Pago'
 */
router.get('/pagos', authMiddleware, PagosController.getPagos);

/**
 * @swagger
 * /pagos/{id}:
 *   get:
 *     summary: Obtener un pago por ID
 *     description: Retorna los detalles de un pago específico identificado por su ID.
 *     tags:
 *       - Pagos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pago
 *     responses:
 *       200:
 *         description: Pago obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pago'
 *       404:
 *         description: Pago no encontrado.
 */
router.get('/pagos/:id', authMiddleware, PagosController.getPago);

/**
 * @swagger
 * /pagos:
 *   post:
 *     summary: Registrar un nuevo pago
 *     description: Permite registrar un nuevo pago en el sistema.
 *     tags:
 *       - Pagos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pago'
 *     responses:
 *       201:
 *         description: Pago registrado exitosamente.
 *       400:
 *         description: Datos del pago inválidos.
 */
router.post('/pagos', authMiddleware, PagosController.addPago);

/**
 * @swagger
 * /pagos/clientes/{id_cliente}:
 *   get:
 *     summary: Obtener todos los pagos de un cliente específico
 *     description: Retorna todos los pagos realizados por un cliente específico con soporte para paginación.
 *     tags:
 *       - Pagos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_cliente
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de la página a obtener.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de elementos por página.
 *     responses:
 *       200:
 *         description: Pagos del cliente obtenidos exitosamente.
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
 *                   example: 20
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pago'
 *       404:
 *         description: Cliente no encontrado o no tiene pagos registrados.
 */
router.get('/pagos/clientes/:id_cliente', authMiddleware, PagosController.getPagosByCliente);

/**
 * @swagger
 * /pagos/pendientes:
 *   get:
 *     summary: Listar pagos pendientes
 *     description: Retorna una lista de todos los pagos con estado "Pendiente" con soporte para paginación.
 *     tags:
 *       - Pagos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de la página a obtener.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de elementos por página.
 *     responses:
 *       200:
 *         description: Lista de pagos pendientes obtenida exitosamente.
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
 *                   example: 3
 *                 totalItems:
 *                   type: integer
 *                   example: 30
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pago'
 */
router.get('/pagos/pendientes', authMiddleware, PagosController.getPagosPendientes);

/**
 * @swagger
 * /pagos/{id}:
 *   patch:
 *     summary: Actualizar el estado de un pago
 *     description: Permite actualizar el estado de un pago existente.
 *     tags:
 *       - Pagos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pago.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 description: Nuevo estado del pago.
 *             example:
 *               estado: "Completado"
 *     responses:
 *       200:
 *         description: Estado del pago actualizado exitosamente.
 *       404:
 *         description: Pago no encontrado.
 *       400:
 *         description: Datos inválidos.
 */
router.patch('/pagos/:id', authMiddleware, PagosController.editPago);

module.exports = router;
