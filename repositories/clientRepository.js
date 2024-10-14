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

// Obtener todos los clientes
const getAllClients = async () => {
  const data = readFile();
  return data.clientes;
};

// Obtener cliente por ID
const getClientById = async (id) => {
  const data = readFile();
  return data.clientes.find((c) => c.id_cliente === parseInt(id));
};

// Crear nuevo cliente
const createClient = async (clientData) => {
  const data = readFile();
  const newClient = {
    id_cliente: data.clientes.length + 1, // Asignación sencilla del ID
    ...clientData
  };
  data.clientes.push(newClient);
  writeFile(data);
  return newClient;
};

// Actualizar cliente
const updateClient = async (id, clientData) => {
  const data = readFile();
  const clientIndex = data.clientes.findIndex((c) => c.id_cliente === parseInt(id));
  if (clientIndex === -1) return null;

  data.clientes[clientIndex] = { ...data.clientes[clientIndex], ...clientData };
  writeFile(data);
  return data.clientes[clientIndex];
};

// Eliminar cliente
const deleteClient = async (id) => {
  const data = readFile();
  const clientIndex = data.clientes.findIndex((c) => c.id_cliente === parseInt(id));
  if (clientIndex === -1) return null;

  const deletedClient = data.clientes.splice(clientIndex, 1);
  writeFile(data);
  return deletedClient;
};

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
};
