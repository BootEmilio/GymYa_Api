const jwt = require('jsonwebtoken');
const db = require('../db'); // Conexión a la base de datos
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;
const tokenExpiration = process.env.JWT_EXPIRATION || '2h';

const authenticateAdmin = async (username, password) => {
    try {
        const result = await db.query(
            'SELECT * FROM administradores WHERE username = $1 AND password = $2',
            [username, password]
        );

        const admin = result.rows[0];
        if (admin) {
            // Verifica que el `gym_id` esté incluido en los datos del administrador
            const token = jwt.sign(
                {
                    id: admin.id,
                    username: admin.username,
                    gym_id: admin.gym_id, // Incluye el gym_id aquí
                    role: 'administrador'
                },
                secretKey,
                { expiresIn: tokenExpiration }
            );
            return { token, admin };
        }
        return null; // Si no se encuentra el administrador
    } catch (error) {
        console.error('Error al autenticar al administrador:', error);
        throw new Error('Error al autenticar');
    }
};

module.exports = { authenticateAdmin };
