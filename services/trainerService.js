// services/trainerService.js
const Trainer = require('../models/trainerModel');
const trainerRepository = require('../repositories/trainerRepository');

const getAllTrainers = () => {
  return trainerRepository.getAllTrainers();
};

const getTrainerById = (id) => {
  return trainerRepository.getTrainerById(id);
};

const createTrainer = (trainerData) => {
  const newTrainer = new Trainer(
    trainerData.id_entrenador,
    trainerData.codigo_gym,
    trainerData.nombre,
    trainerData.apellido,
    trainerData.fecha_nacimiento,
    trainerData.contacto,
    trainerData.username,
    trainerData.password,
    trainerData.imagen
  );
  return trainerRepository.createTrainer(newTrainer);
};

const updateTrainer = (id, trainerData) => {
  return trainerRepository.updateTrainer(id, trainerData);
};

const deleteTrainer = (id) => {
  return trainerRepository.deleteTrainer(id);
};

module.exports = {
  getAllTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
};
