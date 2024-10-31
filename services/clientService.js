// services/clientService.js
const Client = require('../models/clientModel');
const clientRepository = require('../repositories/clientRepository');

// Obtener todos los clientes
const getAllClients = async () => {
  return await clientRepository.getAllClients();
};

// Obtener cliente por ID
const getClientById = async (id) => {
  return await clientRepository.getClientById(id);
};

// Crear un nuevo cliente
const createClient = async (clientData) => {
  const newClient = new Client(
    null,  // id_cliente se generará automáticamente en la BD
    clientData.nombre,
    clientData.apellido,
    clientData.contacto,
    clientData.email,
    clientData.fecha_registro,
    clientData.imagen
  );
  return await clientRepository.createClient(newClient);
};

// Actualizar un cliente por ID
const updateClient = async (id, clientData) => {
  return await clientRepository.updateClient(id, clientData);
};

// Eliminar un cliente por ID
const deleteClient = async (id) => {
  return await clientRepository.deleteClient(id);
};

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};
