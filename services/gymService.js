const gymRepository = require('../repositories/gymRepository');

const getAllGyms = async () => {
  return await gymRepository.getAllGyms();
};

const getGymById = async (id) => {
  return await gymRepository.getGymById(id);
};

const createGym = async (gymData) => {
  return await gymRepository.createGym(gymData);
};

const updateGym = async (id, gymData) => {
  return await gymRepository.updateGym(id, gymData);
};

const deleteGym = async (id) => {
  return await gymRepository.deleteGym(id);
};

module.exports = {
  getAllGyms,
  getGymById,
  createGym,
  updateGym,
  deleteGym
};
