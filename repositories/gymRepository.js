const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/gimnasios.json');

// Leer archivo JSON
const readFile = () => {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// Guardar archivo JSON
const writeFile = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Obtener todos los gimnasios
const getAllGyms = async () => {
  const data = readFile();
  return data.gimnasios;
};

// Obtener gimnasio por ID
const getGymById = async (id) => {
  const data = readFile();
  return data.gimnasios.find((g) => g.id_gym === parseInt(id));
};

// Crear nuevo gimnasio
const createGym = async (gymData) => {
  const data = readFile();
  const newGym = {
    id_gym: data.gimnasios.length + 1, // Asignación sencilla del ID
    ...gymData
  };
  data.gimnasios.push(newGym);
  writeFile(data);
  return newGym;
};

// Actualizar gimnasio
const updateGym = async (id, gymData) => {
  const data = readFile();
  const gymIndex = data.gimnasios.findIndex((g) => g.id_gym === parseInt(id));
  if (gymIndex === -1) return null;

  data.gimnasios[gymIndex] = { ...data.gimnasios[gymIndex], ...gymData };
  writeFile(data);
  return data.gimnasios[gymIndex];
};

// Eliminar gimnasio
const deleteGym = async (id) => {
  const data = readFile();
  const gymIndex = data.gimnasios.findIndex((g) => g.id_gym === parseInt(id));
  if (gymIndex === -1) return null;

  const deletedGym = data.gimnasios.splice(gymIndex, 1);
  writeFile(data);
  return deletedGym;
};

module.exports = {
  getAllGyms,
  getGymById,
  createGym,
  updateGym,
  deleteGym
};
