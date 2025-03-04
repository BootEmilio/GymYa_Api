//Aquí se van a encontrar todos los services para crear y editar a los administradores
const Gym = require('../models/gym');
const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;
const tokenExpiration = process.env.JWT_EXPIRATION || '72h';

//Servicio para agregar el primer administrador
const registro = async (username, password, nombre_completo, email, telefono) => {
  try {
    // Crear el gimnasio
    const nuevoGimnasio = await Gym.create({
        nombre: 'Nombre del gimnasio',
        direccion: 'Dirección del gimnasio',
        telefono: 'Teléfono del gimnasio',
        horario: '8:00 a.m. - 10:00 p.m.'
    });

    const gym_id = [nuevoGimnasio._id];

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el administrador con la contraseña hasheada
    const nuevoAdmin = await Admin.create({
        gym_id,
        username,
        password: hashedPassword,
        nombre_completo,
        email,
        telefono,
        principal: true
    });

    return { success: true, message: 'Registro exitoso', gimnasio: nuevoGimnasio, admin: nuevoAdmin };
    } catch (error){
      console.error('Erros al registrar el primer administrador:', error);
      throw new Error('Error al registrar el primer administrador');
    }
};

const authenticateAdmin = async (admin) => {
    try {
        // Crear el token
        const token = jwt.sign(
            {
                id: admin._id,
                username: admin.username,
                role: 'administrador',
                gym_id: admin.gym_id // Array de gimnasios
            },
            secretKey,
            { expiresIn: tokenExpiration }
        );

        return { token, admin };
    } catch (error) {
        console.error('Error en el servicio de autenticación:', error);
        throw new Error('Error al autenticar');
    }
};

module.exports = { registro, authenticateAdmin };