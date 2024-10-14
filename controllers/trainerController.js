
const trainerService = require('../services/trainerService');

const getAllTrainers = async (req, res) => {
  try {
    const entrenadores = await trainerService.getAllTrainers();
    res.json(entrenadores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTrainerById = async (req, res) => {
  try {
    const entrenador = await trainerService.getTrainerById(parseInt(req.params.id));
    if (!entrenador) return res.status(404).json({ error: 'Entrenador no encontrado' });
    res.json(entrenador);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createTrainer = async (req, res) => {
  try {
    const newTrainer = await trainerService.createTrainer(req.body);
    res.status(201).json(newTrainer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTrainer = async (req, res) => {
  try {
    const updatedTrainer = await trainerService.updateTrainer(parseInt(req.params.id), req.body);
    if (!updatedTrainer) return res.status(404).json({ error: 'Entrenador no encontrado' });
    res.json(updatedTrainer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTrainer = async (req, res) => {
  try {
    const deletedTrainer = await trainerService.deleteTrainer(parseInt(req.params.id));
    if (!deletedTrainer) return res.status(404).json({ error: 'Entrenador no encontrado' });
    res.json(deletedTrainer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
};
