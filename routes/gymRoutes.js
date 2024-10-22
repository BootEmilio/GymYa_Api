const express = require('express');
const gymController = require('../controllers/gymController');
const loggerMiddleware = require('../middlewares/loggerMiddleware');
const router = express.Router();

/**
 * @swagger
 * /api/gimnasios:
 *   get:
 *     summary: Obtiene todos los gimnasios
 *     tags: [Gimnasios]
 *     responses:
 *       200:
 *         description: Lista de gimnasios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Gym'
 */
router.get('/gimnasios', loggerMiddleware, gymController.getAllGyms);

/**
 * @swagger
 * /api/gimnasios/{id}:
 *   get:
 *     summary: Obtiene un gimnasio por ID
 *     tags: [Gimnasios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del gimnasio
 *     responses:
 *       200:
 *         description: Gimnasio obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gym'
 *       404:
 *         description: Gimnasio no encontrado
 */
router.get('/gimnasios/:id', loggerMiddleware, gymController.getGymById);

/**
 * @swagger
 * /api/gimnasios:
 *   post:
 *     summary: Crea un nuevo gimnasio
 *     tags: [Gimnasios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Gym'
 *     responses:
 *       201:
 *         description: Gimnasio creado exitosamente
 */
router.post('/gimnasios', loggerMiddleware, gymController.createGym);

/**
 * @swagger
 * /api/gimnasios/{id}:
 *   patch:
 *     summary: Actualiza un gimnasio por ID
 *     tags: [Gimnasios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del gimnasio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Gym'
 *     responses:
 *       200:
 *         description: Gimnasio actualizado exitosamente
 */
router.patch('/gimnasios/:id', loggerMiddleware, gymController.updateGym);

/**
 * @swagger
 * /api/gimnasios/{id}:
 *   delete:
 *     summary: Elimina un gimnasio por ID
 *     tags: [Gimnasios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del gimnasio
 *     responses:
 *       200:
 *         description: Gimnasio eliminado exitosamente
 */
router.delete('/gimnasios/:id', loggerMiddleware, gymController.deleteGym);

module.exports = router;