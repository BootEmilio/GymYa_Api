const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Cargar variables de entorno
const bcrypt = require('bcrypt'); // Para comparar contraseñas encriptadas

const secretKey = process.env.JWT_SECRET; // Cargar la clave secreta desde .env
const tokenExpiration = process.env.JWT_EXPIRATION || '1h'; // Tiempo de expiración del token desde .env

// Ruta del archivo JSON de usuarios
const usersFilePath = path.join(__dirname, '../data/users.json');

// Función para cargar los usuarios desde el archivo JSON
const getUsers = () => {
  const data = fs.readFileSync(usersFilePath, 'utf-8');
  return JSON.parse(data);
};

// Autenticar usuario
const authenticateUser = async (username, password) => {
  const users = getUsers();

  // Buscar el usuario por username
  const user = users.find((user) => user.username === username);

  if (user) {
    // Comparar la contraseña ingresada con la almacenada usando bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Generar el token JWT
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        secretKey,
        { expiresIn: tokenExpiration } // Utilizar la expiración definida en el .env
      );

      return { token, user }; // Devuelve el token y la información del usuario
    }
  }

  return null; // Credenciales inválidas
};

module.exports = { authenticateUser };
