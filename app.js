const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const swaggerUI = require("swagger-ui-express");
const specs = require("./swagger/swagger");
//Ruta para los registros
const registrosRoutes = require('./routes/registrosRoutes');
//Ruta de los logins
const loginsRoutes = require('./routes/loginsRoutes');
// Rutas de administradores
const adminRoutes = require('./routes/adminRoutes');
const gymRoutes = require('./routes/gymRoutes');
const planesRoutes = require('./routes/planesRoutes');
const membresiasRoutes = require('./routes/membresiasRoutes');
const entrenadoresRoutes = require('./routes/entrenadorRoutes');
const asistenciasRoutes = require('./routes/asistenciasRoutes'); 
// Rutas para usuarios
const userRoutes = require('./routes/userRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const app = express();
connectDB();

const corsOptions = {
  origin: 'https://gymya-web.onrender.com', // Permitir solo tu frontend
  methods: 'GET,POST,PUT,DELETE', // Métodos permitidos
  allowedHeaders: 'Content-Type,Authorization', // Headers permitidos
};

// Permitir que Express sirva archivos estáticos desde la carpeta "uploads"
app.use('/uploads', express.static('uploads'));

// Aplicar CORS a todas las rutas
app.use(cors(corsOptions));

app.use(express.json());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(loggerMiddleware);

//Ruta para los registros
app.use('/api', registrosRoutes);//Registro de administradores y entrenadores independientes

//Ruta para los logins
app.use('/api', loginsRoutes); //Login de los administradores, usuarios y entrenadores

app.use(authMiddleware); //De aquí en adelante las rutas necesitan del token

//Rutas para administradores
app.use('/api', gymRoutes); // Crear, ver y editar gimnasio
app.use('/api', planesRoutes); // Agregar, ver, editar y "eliminar" planes de membresía
app.use('/api', entrenadoresRoutes); //Agregar entrenador

//Rutas para usuarios
app.use('/api', userRoutes); // Editar número de télefono, imagen, contraseña y email

//Rutas para ambos
app.use('/api', membresiasRoutes); //Agregar membresias y usuarios nuevas, ver y aplazar membresía existentes
app.use('/api', asistenciasRoutes); // Registrar entradas y salidas, consultarlas como admin y user

//Rutas para entrenadores

app.use('/api', adminUsersRoutes);
app.use('/api', adminPaymentsRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});