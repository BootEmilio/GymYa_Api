//Aquí se encuentran los services para el manejo de gimnasios
const db = require('../db');
require('dotenv').config();

//Servicio para agregar un gimnasio
const crearGimnasio = async (nombre, direccion, telefono, fechaRegistro) => {
    try {
      const result = await db.query(
        'INSERT INTO gimnasios(nombre, direccion, telefono, fecha_registro) VALUES($1,$2,$3,$4) RETURNING *',
        [nombre, direccion, telefono, fechaRegistro]
      );
      return result.rows[0];
    } catch (error){
      console.error('Erros al crear un gimnasio nuevo:', error);
      throw new Error('Error al crear el gimnasio');
    }
};

//Servicio para editar datos del gimnasio
const editarGimnasio = async (id, nombre, direccion, telefono) => {
    try{
        let fields = [];
        let values = [];
        let index = 1;

        if (nombre) {
            fields.push(`nombre = $${index++}`);
            values.push(nombre); 
        }
        if (direccion) {
            fields.push(`direccion = $${index++}`);
            values.push(direccion); 
        }
        if (telefono) {
            fields.push(`telefono = $${index++}`);
            values.push(telefono); 
        }

        if (fields.length === 0) {
            throw new Error('No se han proporcionado datos para actualizar.');
        } 

        values.push(id);

        const query = `
            UPDATE gimnasios
            SET ${fields.join(', ')}
            WHERE id = $${index}
            RETURNING *;
        `;

        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            throw new Error('Gimnasio no encontrado');
        }

        return result.rows[0];
    }catch (error) {
        console.error('Error al editar gimnasio:', error);
        throw new Error('Error al editar el gimnasio');
    }
}

module.exports = { crearGimnasio, editarGimnasio };