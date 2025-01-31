// db.js
const mongoose = require('mongoose');
require('dotenv').config();  // Cargar las variables de entorno desde el archivo .env

// Función para conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,       // Opciones recomendadas por Mongoose
      useUnifiedTopology: true,    // Usar el nuevo motor de topología unificada
    });
    console.log('Conectado a MongoDB correctamente');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);  // Termina la aplicación si no puede conectarse a la base de datos
  }
};

module.exports = connectDB;