// repositories/trainerRepository.js
const fs = require('fs');
const path = require('path');
const dataFilePath = path.join(__dirname, '../data/gimnasios.json');

const getAllTrainers = () => {
  const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  return data.entrenadores;
};

const getTrainerById = (id) => {
  const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  return data.entrenadores.find((entrenador) => entrenador.id_entrenador === id);
};

const saveData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
};

const createTrainer = (newTrainer) => {
  const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  data.entrenadores.push(newTrainer);
  saveData(data);
  return newTrainer;
};

const updateTrainer = (id, updatedTrainer) => {
  const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  const index = data.entrenadores.findIndex((entrenador) => entrenador.id_entrenador === id);
  if (index !== -1) {
    data.entrenadores[index] = { ...data.entrenadores[index], ...updatedTrainer };
    saveData(data);
    return data.entrenadores[index];
  }
  return null;
};

const deleteTrainer = (id) => {
  const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  const index = data.entrenadores.findIndex((entrenador) => entrenador.id_entrenador === id);
  if (index !== -1) {
    const deletedTrainer = data.entrenadores.splice(index, 1);
    saveData(data);
    return deletedTrainer[0];
  }
  return null;
};

module.exports = {
  getAllTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
};
