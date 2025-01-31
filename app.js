const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const swaggerUI = require("swagger-ui-express");
const specs = require("./swagger/swagger");
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const gymRoutes = require('./routes/gymRoutes');
const planesRoutes = require('./routes/planesRoutes');
const addGymRoutes = require('./routes/addGymAdmin');
const userAuthRoutes = require('./routes/userAuthRoutes');
const adminUsersRoutes = require('./routes/adminUsersRoutes'); // Rutas de clientes
const adminPaymentsRoutes = require ('./routes/adminPaymentsRoutes');
const userAttendanceRoutes = require('./routes/userAttendanceRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const app = express();
connectDB();

app.use(cors({ origin: 'https://bootemilio.github.io' }));
app.use(express.json());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(loggerMiddleware);


//Rutas para administradores
app.use('/api/admin', adminAuthRoutes); // Registro y Login para administradores
app.use('/api/admin', gymRoutes); //Agregar y editar gimnasio
app.use('/api/admin', planesRoutes); //Agregar, ver y editar planes de membresía
app.use('/api/admin', addGymRoutes);
//Rutas para usuarios
app.use('/api/user', userAuthRoutes); // Login para usuarios
app.use('/api/user', userAttendanceRoutes); // Ver asistencias agregar

app.use(authMiddleware);

app.use('/api', adminUsersRoutes);
app.use('/api', adminPaymentsRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});