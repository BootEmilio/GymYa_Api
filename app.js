const express = require('express');
const cors = require('cors');
const swaggerUI = require("swagger-ui-express");
const specs = require("./swagger/swagger");
const authRoutes = require('./routes/authRoutes'); // Rutas de autenticación
const adminRoutes = require('./routes/adminRoutes');
const clientRoutes = require('./routes/clientRoutes'); // Rutas de clientes
const pagosRoutes = require ('./routes/pagosRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const app = express();

app.use(cors({ origin: 'https://bootemilio.github.io' }));

app.use(express.json());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(loggerMiddleware);

app.use('/api', authRoutes);

app.use(authMiddleware);

app.use('/api', adminRoutes);
app.use('/api', clientRoutes);
app.use('/api', pagosRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});