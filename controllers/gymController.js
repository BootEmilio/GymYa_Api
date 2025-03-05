const gymService = require('../services/gymService');
const cloudinary = require('../cloudinary-config');
const fs = require('fs'); // para manejar el borrado de archivos temporales
const Gym = require('../models/gym');
const Admin = require('../models/admin');

//Controlador para agregar gimnasios
const crearGimnasio = async (req, res) => {
    try{
        const { nombre, direccion, telefono, horario } = req.body;
        const adminId = req.user.id; //Obtenemos el _id del administraddr por medio de su token

        //Verificar que exista el admin
        const administrador = await Admin.findById(adminId);
        if(!administrador){
            return res.status(400).json({ error: 'No existe este administrador' });
        }

        // Validar campos obligatorios
        if (!nombre || !direccion || !telefono || !horario) {
            return res.status(400).json({ error: 'Llene todos los campos del gimnasio' });
        }

        // Validar si hay un archivo de imagen en la petición
        if (!req.file) {
            return res.status(400).json({ error: 'Suba una imagen de su gimnasios' });
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

//Controlador para que el admin vea sus gimnasios
const verGimnasios = async (req, res) => {
    try {
        const adminId = req.user.id; // Obtener el ID del administrador desde el token

        //Verificar que exista el admin
        const administrador = await Admin.findById(adminId);
        if(!administrador){
            return res.status(400).json({ error: 'No existe este administrador' });
        }

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

//Para que pueda buscar un gym por id el admin
const obtenerGimnasioPorId = async (req, res) => {
    try {
        const { gymId } = req.params;

        // Buscar el gimnasio en la base de datos
        const gimnasio = await Gym.findById(gymId);

        if (!gimnasio) {
            return res.status(404).json({ error: "Gimnasio no encontrado" });
        }

        // Enviar el gimnasio encontrado
        res.status(200).json(gimnasio);
    } catch (error) {
        console.error("Error al obtener el gimnasio:", error);
        res.status(500).json({ error: "Error al obtener el gimnasio" });
    }
};

//Controlador para editar gimnasios
const editarGimnasio = async (req, res) => {
    try{
        const { nombre, direccion, telefono, horario } = req.body;
        const {gymId} = req.params; //Se obtiene por medio de la ruta
        const adminGymIds = req.user.gym_id; // Array de gym_id del administrador

        // Buscar el gimnasio en la base de datos usando Mongoose
        const gimnasioActual = await Gym.findById(gymId);
        if (!gimnasioActual) {
            return res.status(404).json({ error: 'Gimnasio no encontrado' });
        }

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

        // Verificar si hay una imagen nueva en la solicitud
        if(req.file) {
            const imagenActualUrl = gimnasioActual.imagen; // Obtener la imagen actual

            // Subir la nueva imagen a Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);
            const nuevaImagenUrl = result.secure_url;

            // Guardar la URL de la nueva imagen en los campos de actualización
            updateFields.imagen = nuevaImagenUrl;

            // Eliminar la imagen anterior de Cloudinary (si existe)
            if (imagenActualUrl) {
                const imagenId = imagenActualUrl.split('/').pop().split('.')[0]; // Extraer el ID de la imagen
                await cloudinary.uploader.destroy(imagenId);
            }

            // Eliminar el archivo temporal subido
            fs.unlinkSync(req.file.path);
        }

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

//Controlador para que el usuario vea los gimnasios a los que puede acceder con su membresía
const verGimnasiosUser = async (req, res) => {
    try {
        const {membresiaId} = req.params; // Obtener el ID de la membresía desde la URL

        // Llamar al servicio para obtener los gimnasios
        const gimnasios = await gymService.verGimnasiosUser(membresiaId);

        res.status(200).json(gimnasios);
    } catch (error) {
        console.error('Error en el controlador de obtenerGimnasiosDeAdmin:', error);
        if (error.message === 'Membresía no encontrada') {
            return res.status(404).json({ error: 'Membresía no encontrada' });
        }
        res.status(500).json({ error: 'Error al obtener los gimnasios de la membresía' });
    }
};

module.exports = { crearGimnasio, verGimnasios, editarGimnasio, verGimnasiosUser, obtenerGimnasioPorId  };