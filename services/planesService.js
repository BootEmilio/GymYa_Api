const db = require('../db');
require('dotenv').config();

// Servicio para agregar un tipo de plan de membresía
const crearPlanes = async (gym_id, nombre, descripcion, costo, duracion, fecha_creacion) => {
    try {
        const result = await db.query(
            'INSERT INTO planes (gym_id, nombre, descripcion, costo, duracion_meses, fecha_creacion, activo) VALUES ($1, $2, $3, $4, $5, $6, TRUE) RETURNING *',
            [gym_id, nombre, descripcion, costo, duracion, fecha_creacion]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error al crear membresía:', error);
        throw new Error('Error al crear la membresía');
    }
};

//Servicio para mostrar todos los planes de membresía
const mostrarPlanes = async (gymId) => {
    try {
        let query = 'SELECT id, gym_id, nombre, descripcion, costo, duracion FROM planes WHERE activo = TRUE AND gym_id = $1';
        const values = [gymId];  // gym_id es obligatorio, así que siempre será el primer valor

        // Ordenamos por costo de menor a mayor
        query += ' ORDER BY costo ASC';

        const planes = await db.query(query, values);
        return planes.rows;
    } catch (error) {
        console.error('Error al mostrar los planes de membresía:', error);
        throw new Error('Error al mostrar los planes de membresía');
    }
};

// Servicio para editar un plan existente de membresía
const editarPlanes = async (id, gymId, nombre, descripcion, costo, duracion) => {
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
            fields.push(`duracion_meses = $${index++}`);
            values.push(duracion);
        }

        if (fields.length === 0) {
            throw new Error('No se han proporcionado datos para actualizar.');
        }

        values.push(id); // El ID siempre es el último parámetro

        const query = `
            UPDATE planes
            SET ${fields.join(', ')}
            WHERE id = $${index} AND gym_id = $${index + 1}
            RETURNING *;
        `;
        values.push(gymId);

        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            throw new Error('Plan no encontrado o no pertenece al gimnasio');
        }

        return result.rows[0];
    } catch (error) {
        console.error('Error al editar el plan:', error);
        throw new Error('Error al editar el plan');
    }
};

//Servicio para "eliminar" planes de membresía
const eliminarPlan = async (id, gymId) => {
    try {
        const query = `
            UPDATE planes
            SET activo = FALSE
            WHERE id = $1 AND gym_id = $2
            RETURNING *;
        `;
        const values = [id, gymId];
        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            throw new Error('Plan no encontrado o no pertenece al gimnasio');
        }

        return result.rows[0];
    } catch (error) {
        console.error('Error al eliminar el plan:', error);
        throw new Error('Error al eliminar el plan');
    }
};

module.exports = { crearPlanes, mostrarPlanes, editarPlanes, eliminarPlan };