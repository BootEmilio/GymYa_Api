const express = require('express');
const router = express.Router();
const userController = require('../controllers/adminUsersController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener todos los usuarios con paginación
 *     description: Retorna una lista paginada de los usuarios registrados en el sistema. Puedes especificar el número de página y la cantidad de resultados por página.
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Número de la página que deseas consultar (1 es la primera página).
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: pageSize
 *         in: query
 *         description: Número de usuarios por página.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                   description: Página actual.
 *                 totalPages:
 *                   type: integer
 *                   description: Número total de páginas disponibles.
 *                 pageSize:
 *                   type: integer
 *                   description: Número de usuarios por página.
 *                 totalUsers:
 *                   type: integer
 *                   description: Número total de usuarios.
 *                 users:
 *                   type: array
 *                   description: Lista de usuarios en la página actual.
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado. Token inválido o faltante.
 */
router.get('/usuarios', authMiddleware, userController.getAllUsers);


/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     description: Retorna los detalles de un usuario específico identificado por su ID.
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado.
 */
router.get('/usuarios/:id', authMiddleware, userController.getUserById);

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     description: Permite registrar un nuevo usuario en el sistema.
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
 *       400:
 *         description: Datos del usuario inválidos.
 */
router.post('/usuarios', authMiddleware, userController.createUser);

/**
 * @swagger
 * /usuarios/{id}:
 *   patch:
 *     summary: Actualizar un usuario
 *     description: Permite actualizar la información de un usuario existente.
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente.
 *       404:
 *         description: Usuario no encontrado.
 *       400:
 *         description: Datos inválidos.
 */
router.patch('/usuarios/:id', authMiddleware, userController.updateUser);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     description: Permite eliminar un usuario específico identificado por su ID.
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente.
 *       404:
 *         description: Usuario no encontrado.
 */
router.delete('/usuarios/:id', authMiddleware, userController.deleteUser);

module.exports = router;
