const gymService = require('../services/gymService');
const cloudinary = require('./cloudinary-config');
const fs = require('fs'); // para manejar el borrado de archivos temporales

//Controlador para agregar gimnasios
const crearGimnasio = async (req, res) => {
    try{
        const { nombre, direccion, telefono, horario } = req.body;
        const adminId = req.user.id; //Obtenemos el _id del administraddr por medio de su token

        // Validar campos obligatorios
        if (!nombre || !direccion || !telefono || !horario) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Validar si hay un archivo de imagen en la petición
        if (!req.file) {
            return res.status(400).json({ error: 'La imagen es obligatoria' });
        }

        // Subir imagen a Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        // Guardar la URL de la imagen
        const imagenUrl = result.secure_url;

        const nuevoGimnasio = await gymService.crearGimnasio(nombre, direccion, telefono, horario, adminId, imagenUrl);

        // Eliminar el archivo temporal subido
        fs.unlinkSync(req.file.path);

        res.status(201).json(nuevoGimnasio);
    }catch (error) {
        console.error('Error en el controlador de crearNuevoGimnasio:', error);
        res.status(500).json({error: 'Error al crear nuevo gimnasio'});
    }
};

//Controlador para ver gimnasios
const verGimnasios = async (req, res) => {
    try {
        const adminId = req.user.id; // Obtener el ID del administrador desde el token

        // Llamar al servicio para obtener los gimnasios
        const gimnasios = await gymService.verGimnasios(adminId);

        res.status(200).json(gimnasios);
    } catch (error) {
        console.error('Error en el controlador de obtenerGimnasiosDeAdmin:', error);
        if (error.message === 'Administrador no encontrado') {
            return res.status(404).json({ error: 'Administrador no encontrado' });
        }
        res.status(500).json({ error: 'Error al obtener los gimnasios del administrador' });
    }
};

//Controlador para editar gimnasios
const editarGimnasio = async (req, res) => {
    try{
        const { nombre, direccion, telefono, horario } = req.body;
        const {gymId} = req.params; //Se obtiene por medio de la ruta
        const adminGymIds = req.user.gym_id; // Array de gym_id del administrador

        // Verificar si el gymId está en el array de gym_id del administrador
        if (!adminGymIds.includes(gymId)) {
            return res.status(403).json({ error: 'No tienes permisos para editar este gimnasio' });
        }

        // Construimos un objeto con los campos que fueron proporcionados
        const updateFields = {};
        if (nombre) updateFields.nombre = nombre;
        if (direccion) updateFields.direccion = direccion;
        if (telefono) updateFields.telefono = telefono;
        if (horario) updateFields.horario = horario;

        // Si no se proporcionaron campos, lanzamos un error
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: 'No se han proporcionado datos para actualizar' });
        }
        
        const actualizado = await gymService.editarGimnasio(gymId, updateFields);

        res.status(200).json(actualizado);
    }catch (error) {
        console.error('Error en el controlador de editarGimnasio:', error);
        if (error.message === 'Gimnasio no encontrado') {
            return res.status(404).json({ error: 'Gimnasio no encontrado' });
        }
        res.status(500).json({ error: 'Error al actualizar el gimnasio' });
    }
};

module.exports = { crearGimnasio, verGimnasios, editarGimnasio };