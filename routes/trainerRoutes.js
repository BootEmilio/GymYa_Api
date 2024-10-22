const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const loggerMiddleware = require('../middlewares/loggerMiddleware');

/**
 * @swagger
 * /api/entrenadores:
 *   get:
 *     summary: Obtiene todos los entrenadores
 *     tags: [Entrenadores]
 *     responses:
 *       200:
 *         description: Lista de entrenadores obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trainer'
 */
router.get('/entrenadores', loggerMiddleware, trainerController.getAllTrainers);

/**
 * @swagger
 * /api/entrenadores/{id}:
 *   get:
 *     summary: Obtiene un entrenador por ID
 *     tags: [Entrenadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del entrenador
 *     responses:
 *       200:
 *         description: Entrenador obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trainer'
 *       404:
 *         description: Entrenador no encontrado
 */
router.get('/entrenadores/:id', loggerMiddleware, trainerController.getTrainerById);

/**
 * @swagger
 * /api/entrenadores:
 *   post:
 *     summary: Crea un nuevo entrenador
 *     tags: [Entrenadores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trainer'
 *     responses:
 *       201:
 *         description: Entrenador creado exitosamente
 */
router.post('/entrenadores', loggerMiddleware, trainerController.createTrainer);

/**
 * @swagger
 * /api/entrenadores/{id}:
 *   patch:
 *     summary: Actualiza un entrenador por ID
 *     tags: [Entrenadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del entrenador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trainer'
 *     responses:
 *       200:
 *         description: Entrenador actualizado exitosamente
 */
router.patch('/entrenadores/:id', loggerMiddleware, trainerController.updateTrainer);

/**
 * @swagger
 * /api/entrenadores/{id}:
 *   delete:
 *     summary: Elimina un entrenador por ID
 *     tags: [Entrenadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del entrenador
 *     responses:
 *       200:
 *         description: Entrenador eliminado exitosamente
 */
router.delete('/entrenadores/:id', loggerMiddleware, trainerController.deleteTrainer);

module.exports = router;