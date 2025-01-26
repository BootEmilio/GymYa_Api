const db = require('../db');
require('dotenv').config();

// Servicio para agregar un tipo de plan de membresía
const crearPlanes = async (gym_id, nombre, descripcion, costo, duracion, fecha_creacion) => {
    try {
        const result = await db.query(
            'INSERT INTO planes (gym_id, nombre, descripcion, costo, duracion, fecha_creacion) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [gym_id, nombre, descripcion, costo, duracion, fecha_creacion]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error al crear membresía:', error);
        throw new Error('Error al crear la membresía');
    }
};

//Servicio para mostrar todos los planes de membresía
const mostrarPlanes = async (costoMaximo) => {
    try {
        let query = 'SELECT id, gym_id, nombre, descripcion, costo, duracion FROM planes';
        let values = [];

        // Si se pasa un costo máximo, añadimos la condición a la consulta
        if (costoMaximo) {
            query += ' WHERE costo <= $1';
            values.push(costoMaximo);
        }

        const planes = await db.query(query, values);
        return planes.rows;
    } catch (error) {
        console.error('Error al mostrar los planes de membresía:', error);
        throw new Error('Error al mostrar los planes de membresía');
    }
};


// Servicio para editar un plan existente de membresía
const editarPlanes = async (id, nombre, descripcion, costo, duracion) => {
    try {
        let fields = [];
        let values = [];
        let index = 1;

        if (nombre) {
            fields.push(`nombre = $${index++}`);
            values.push(nombre);
        }
        if (descripcion) {
            fields.push(`descripcion = $${index++}`);
            values.push(descripcion);
        }
        if (costo) {
            fields.push(`costo = $${index++}`);
            values.push(costo);
        }
        if (duracion) {
            fields.push(`duracion = $${index++}`);
            values.push(duracion);
        }

        if (fields.length === 0) {
            throw new Error('No se han proporcionado datos para actualizar.');
        }

        values.push(id); // El ID siempre es el último parámetro

        const query = `
            UPDATE planes
            SET ${fields.join(', ')}
            WHERE id = $${index}
            RETURNING *;
        `;

        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            throw new Error('Plan no encontrado');
        }

        return result.rows[0];
    } catch (error) {
        console.error('Error al editar el plan:', error);
        throw new Error('Error al editar el plan');
    }
};

module.exports = { crearPlanes, mostrarPlanes, editarPlanes };