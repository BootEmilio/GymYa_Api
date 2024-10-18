const express = require('express');
const cors = require('cors');
const swaggerUI = require("swagger-ui-express");
const specs = require("./swagger/swagger");
require('dotenv').config();
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/authRoutes');
const gymRoutes = require('./routes/gymRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const clientRoutes = require('./routes/clientRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const app = express();

// Configurar CORS para permitir solicitudes desde tu página GitHub
app.use(cors({ origin: 'https://bootemilio.github.io' }));

// Middleware para parsear JSON
app.use(express.json());

// Documentación Swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// Logger middleware
app.use(loggerMiddleware);

// Rutas públicas
app.use('/api', authRoutes);

// Rutas protegidas por autenticación
app.use('/api', authMiddleware, gymRoutes);
app.use('/api', authMiddleware, trainerRoutes);
app.use('/api', authMiddleware, clientRoutes);

// Cargar variables del .env
const apiUrl = process.env.API_URL;
const port = process.env.PORT || 3000;
const secretKey = process.env.JWT_SECRET;
const tokenExpiration = process.env.JWT_EXPIRATION;

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
