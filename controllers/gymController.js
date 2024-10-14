const gymService = require('../services/gymService');

// Obtener todos los gimnasios
const getAllGyms = async (req, res) => {
  try {
    const gimnasios = await gymService.getAllGyms();
    res.json(gimnasios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un gimnasio por ID
const getGymById = async (req, res) => {
  try {
    const gimnasio = await gymService.getGymById(req.params.id);
    if (!gimnasio) {
      return res.status(404).json({ message: 'Gimnasio no encontrado' });
    }
    res.json(gimnasio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Agregar un nuevo gimnasio
const createGym = async (req, res) => {
  try {
    const newGym = await gymService.createGym(req.body);
    res.status(201).json(newGym);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar un gimnasio
const updateGym = async (req, res) => {
  try {
    const updatedGym = await gymService.updateGym(req.params.id, req.body);
    if (!updatedGym) {
      return res.status(404).json({ message: 'Gimnasio no encontrado' });
    }
    res.json(updatedGym);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un gimnasio
const deleteGym = async (req, res) => {
  try {
    const deletedGym = await gymService.deleteGym(req.params.id);
    if (!deletedGym) {
      return res.status(404).json({ message: 'Gimnasio no encontrado' });
    }
    res.json({ message: 'Gimnasio eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllGyms,
  getGymById,
  createGym,
  updateGym,
  deleteGym
};
