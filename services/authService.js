const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const secretKey = 'Calamardo-Totelini'; // Cambia esto a una clave más segura

// Cargar los usuarios desde el archivo JSON
const usersFilePath = path.join(__dirname, '../data/users.json');

const getUsers = () => {
  const data = fs.readFileSync(usersFilePath, 'utf-8');
  return JSON.parse(data);
};

// Autenticar usuario
const authenticateUser = (username, password) => {
  const users = getUsers();

  // Buscar el usuario por username
  const user = users.find((user) => user.username === username);
  
  if (user && user.password === password) {
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      secretKey,
      { expiresIn: '1h' } // El token expirará en 1 hora
    );

    return { token, user }; // Devuelve el token y la información del usuario
  }

  return null; // Credenciales inválidas
};

module.exports = { authenticateUser };