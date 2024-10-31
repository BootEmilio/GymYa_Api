// repositories/clientRepository.js
const db = require('../db');

const getAllClients = async () => {
  const result = await db.query('SELECT * FROM clientes');
  return result.rows;
};

const getClientById = async (id) => {
  const result = await db.query('SELECT * FROM clientes WHERE id_cliente = $1', [id]);
  return result.rows[0];
};

const createClient = async (client) => {
  const query = `
    INSERT INTO clientes (nombre, apellido, contacto, email, fecha_registro, imagen)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
  const values = [client.nombre, client.apellido, client.contacto, client.email, client.fecha_registro, client.imagen];
  const result = await db.query(query, values);
  return result.rows[0];
};

const updateClient = async (id, clientData) => {
  const query = `
    UPDATE clientes
    SET nombre = $1, apellido = $2, contacto = $3, email = $4, fecha_registro = $5, imagen = $6
    WHERE id_cliente = $7 RETURNING *`;
  const values = [clientData.nombre, clientData.apellido, clientData.contacto, clientData.email, clientData.fecha_registro, clientData.imagen, id];
  const result = await db.query(query, values);
  return result.rows[0];
};

const deleteClient = async (id) => {
  await db.query('DELETE FROM clientes WHERE id_cliente = $1', [id]);
};

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};
