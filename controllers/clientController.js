// controllers/clientController.js
const Client = require('../models/Client');

exports.crearCliente = async (req, res) => {
  try {
    const nuevoCliente = await Client.create(req.body);
    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el cliente' });
  }
};

exports.obtenerCliente = async (req, res) => {
  try {
    const cliente = await Client.findById(req.params.id);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el cliente' });
  }
};

// Otros métodos para actualizar y eliminar clientes
exports.actualizarCliente = async (req, res) => {
  try {
    const clienteActualizado = await Client.update(req.params.id, req.body);
    res.json(clienteActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el cliente' });
  }
};

exports.eliminarCliente = async (req, res) => {
  try {
    await Client.delete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el cliente' });
  }
};
