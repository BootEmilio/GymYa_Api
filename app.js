const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Rutas de autenticación
const gymRoutes = require('./routes/gymRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const clientRoutes = require('./routes/clientRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const app = express();

app.use(cors({ origin: 'https://bootemilio.github.io/emi-gymya/'}));

app.use(express.json());
app.use(loggerMiddleware);

app.use('/api', authRoutes);

app.use(authMiddleware);

// Rutas protegidas por autenticación
app.use('/api', gymRoutes);
app.use('/api', trainerRoutes);
app.use('/api', clientRoutes);

const PORT = process.env.PORT|| 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

