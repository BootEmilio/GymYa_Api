const express = require('express');
const cors = require('cors');
const swaggerUI = require("swagger-ui-express");
const specs = require("./swagger/swagger");
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const userAuthRoutes = require('./routes/userAuthRoutes');
const userRoutes = require('./routes/userRoutes'); // Rutas de clientes
const pagosRoutes = require ('./routes/pagosRoutes');
const accesosRoutes = require('./routes/accesosRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const app = express();

app.use(cors({ origin: 'https://bootemilio.github.io' }));
app.use(express.json());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(loggerMiddleware);

app.use('/api/admin', adminAuthRoutes); // Login para administradores
app.use('/api/user', userAuthRoutes); // Login para usuarios

app.use(authMiddleware);

app.use('/api', adminRoutes);
app.use('/api', userRoutes);
app.use('/api', pagosRoutes);
app.use('/api', accesosRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});