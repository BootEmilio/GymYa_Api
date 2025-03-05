const user = require('../models/usuarios');
const userService= require('../services/userService');
const cloudinary = require('../cloudinary-config');
const fs = require('fs'); // para manejar el borrado de archivos temporales
const bcrypt = require('bcryptjs');

//Controlador para hacer login del usuario en la aplicación móvil
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email y contraseña son requeridos' });
    }

    // Buscar el usuario por email
    const usuario = await user.findOne({ email });  
    if (!usuario) {
      throw res.status(400).json({ message: 'Correo electronico no encontrado no encontrado'});
    }

    // Comparar la contraseña usando bcrypt
    const isPasswordValid = await bcrypt.compare(password, usuario.password);
    if (!isPasswordValid) {
      throw res.status(400).json({ message: 'Contraseña incorrecta'});
    }

    const authResult = await userService.authenticateUser(usuario);

    if (!authResult) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    res.status(200).json({
      message: 'Login exitoso',
      token: authResult.token,
      user: authResult.usuario,
    });
  } catch (error) {
    console.error('Error en el proceso de login del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

//Controlador para editar los datos del usuario
const editarUsuario = async (req, res) => {
  try{
    const { usuarioId } = req.params;
    
    //Buscamos al usuario
    const usuario = await user.findById(usuarioId);
    if(!usuario) {
      res.status(404).json({error: 'Usuario no encontrado'});
    }

    //Creamos el objeto de edición
    const updateFields = [];

    //Verificamos que se pase una imagen en la solicitud
    if(req.file){
      const imagenActualUrl = usuario.imagen; // Obtener la imagen actual

      //Subimos la nueva imagen
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

    const actualizado = await userService.editarUsuario(usuarioId, updateFields);

    res.status(200).json(actualizado);
  }catch (error){
    console.error('Error al subir la imagen', error);
    res.status(500).json({ message: 'Error al subir la imagen' });
  }
};

module.exports = { loginUser, editarUsuario };
