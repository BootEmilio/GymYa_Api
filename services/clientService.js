const Client = require('../models/clientModel');
const clientRepository = require('../repositories/clientRepository');

// Obtener todos los clientes
const getAllClients = () => {
  return clientRepository.getAllClients();
};

// Obtener cliente por ID
const getClientById = (id) => {
  return clientRepository.getClientById(id);
};

// Crear un nuevo cliente
const createClient = (clientData) => {
  const newClient = new Client(
    clientData.id_cliente,
    clientData.nombre,
    clientData.apellido,
    clientData.contacto,
    clientData.email,
    clientData.fecha_registro,
    clientData.imagen
  );
  return clientRepository.createClient(newClient);
};

// Actualizar un cliente por ID
const updateClient = (id, clientData) => {
  return clientRepository.updateClient(id, clientData);
};

// Eliminar un cliente por ID
const deleteClient = (id) => {
  return clientRepository.deleteClient(id);
};

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};
