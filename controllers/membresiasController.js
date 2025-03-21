const membresiasService = require('../services/membresiasService');
const User = require('../models/usuarios');
const Membresia = require('../models/membresias');
const plan = require('../models/planes');
const {MercadoPagoConfig, Preference} = require('mercadopago');

// Configurar MercadoPago con tu Access Token (ahora cn el access token de prueba)
const client = new MercadoPagoConfig({access_token: 'APP_USR-806128994004266-031309-e14a1eacf70ca9d5cb3eb38293ea604a-2326694508'});
const preference = new Preference(client);

//Controlador para registrar usuarios con sus membresias
const registroUsuario = async (req, res) => {
  try{
    const {plan_id, nombre_completo, email} = req.body;

    // Validar que todos los campos estén presentes
    if (!plan_id || !nombre_completo || !email) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Verificar si el email ya existe
    const emailExistente = await User.findOne({ email });
    if (emailExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    //Obtener el plan seleccionado
    const planSeleccionado = await plan.findById(plan_id);
    if(!planSeleccionado){
      return res.status(400).json({error: 'El plan seleccionado no existe'});
    }

    const usuarioNuevo = await membresiasService.registroUsuario(plan_id, nombre_completo, email);
    res.status(201).json(usuarioNuevo);
  }catch (error) {
    res.status(500).json({error: 'Error al registrar el usuario junto a su membresía'});
  }
};

//Controlador para crear membresía de un usuario que ya tiene una cuenta
const crearMembresia = async (req, res) => {
  try{
    const {plan_id, email} = req.body;

    // Validar que todos los campos estén presentes
    if (!plan_id || !email ) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Verificar si el email ya existe
    const emailExistente = await User.findOne({ email });
    if (!emailExistente) {
      return res.status(400).json({ error: 'El email no esta registrado' });
    }

    //Obtener el plan seleccionado
    const planSeleccionado = await plan.findById(plan_id);
    if(!planSeleccionado){
      return res.status(400).json({error: 'El plan seleccionado no existe'});
    }

    const membresiaNueva = await membresiasService.crearMembresia(plan_id, email);
    res.status(201).json(membresiaNueva);
  }catch (error) {
    res.status(500).json({error: 'Error al registrar el usuario junto a su membresía'});
  }
};

//Controlador para ver membresias activas y expiradas de un gimnasio
const getMembresias = async (req, res) => {
  try {
      const { gymId, status } = req.params; // Usamos el gymId y el status de la URL
      const { page = 1, limit = 10, search } = req.query; // Parámetros de paginación y búsqueda

      const adminGymIds = req.user.gym_id; // Array de gym_id del administrador

      // Verificar si el gymId está en el array de gym_id del administrador
      if (!adminGymIds.includes(gymId)) {
        return res.status(403).json({ error: 'No tienes permisos para editar este gimnasio' });
      }

      // Validar si el status es "activas" o "expiradas"
      if (status !== 'activas' && status !== 'expiradas') {
          return res.status(400).json({ error: 'Estado inválido. Use "activas" o "expiradas".' });
      }

      // Llamar al servicio para obtener las membresías
      const { membresias, total } = await membresiasService.getMembresias(gymId, status, page, limit, search);

      // Devolver los resultados como respuesta
      res.status(200).json({
          membresias,
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit)
      });
  } catch (error) {
      console.error('Error en obtener Membresias:', error);
      res.status(500).json({ error: 'Ocurrió un error al obtener las membresías.' });
  }
};

const getMembresiasCount = async (req, res) => {
  const { gymId, status } = req.query; // Recibir gymId y estado como parámetros de consulta

  try {
      // Llamar al servicio para obtener el conteo de membresías
      const result = await membresiasService.getMembresiasCount(gymId, status);

      // Devolver el resultado
      return res.status(200).json(result);
  } catch (error) {
      return res.status(500).json({ message: 'Error al obtener el conteo de membresías', error: error.message });
  }
};

const getTotalMembresias = async (req, res) => {
  const { gymId } = req.query;

  if (!gymId) {
      return res.status(400).json({ error: "El parámetro 'gymId' es requerido." });
  }

  try {
      const result = await membresiasService.getTotalMembresias(gymId);
      return res.status(200).json(result);
  } catch (error) {
      return res.status(500).json({ error: error.message });
  }
};

//Controlador para ver membresias activas y expiradas de un usuario
const getMembresiasUser = async (req, res) => {
  try {
    const userId = req.user.id; //Obtenemos el id del usuario por medio de su token
    if(!userId){
        return res.status(400).json({ error: 'No se encontró el usuario.' });
    }
      // Llamar al servicio para obtener las membresía
      const membresias = await membresiasService.getMembresiasUser(userId);

      // Devolver los resultados como respuesta
      res.status(200).json(membresias);
  } catch (error) { 
      console.error('Error en obtener Membresia:', error);
      res.status(500).json({ error: 'Ocurrió un error al obtener la membresía.' });
  }
};

//Controlador para ver una membresía del usuario
const getMembresia = async (req, res) => {
  try {
    const { membresiaId } = req.params; // Obtenemos el _id de la membresía por parte de la URL

      // Llamar al servicio para obtener la membresía
      const membresia = await membresiasService.getMembresia(membresiaId);

      // Devolver los resultados como respuesta
      res.status(200).json(membresia);
  } catch (error) { 
      console.error('Error en obtener Membresia:', error);
      res.status(500).json({ error: 'Ocurrió un error al obtener la membresía.' });
  }
};

//controlador para aplazar las membresías existentes
const aplazarMembresiaVentanilla = async (req, res) => {
  try{
    const { membresiaId } = req.params; // Obtenemos el _id de la membresía en el URL
    const { plan_id } = req.body; // Obtenemos el id del plan por medio del body

    //Buscamos la membresia por su _id
    const membresiaExiste = await Membresia.findById(membresiaId);
    if(!membresiaExiste){
      return res.status(400).json({error: 'La membresía no existe'});
    }

    //Obtener el plan seleccionado
    const planSeleccionado = await plan.findById(plan_id);
    if(!planSeleccionado){
      return res.status(400).json({error: 'El plan seleccionado no existe'});
    }

    // Llamar al servicio para obtener aplazar las membresias
    const { membresia, pago } = await membresiasService.aplazarMembresia(membresiaId, plan_id);

    // Devolver la membresía actualizada como respuesta, incluyendo la nueva fecha_fin
    res.status(200).json({
      message: 'Membresía actualizada correctamente',
      membresia: {
        _id: membresia._id,
        gym_id: membresia.gym_id,
        plan_id: membresia.plan_id,
        fecha_fin: membresia.fecha_fin, // Nueva fecha_fin
      },
      pago: {
        _id: pago._id,
        membresia_id: pago.membresia_id,
        gym_id: pago.gym_id,
        fecha_hora: pago.fecha_hora,
        concepto: pago.concepto,
        monto: pago.monto,
      }
    });
  }catch (error){
    res.status(500).json({ error: 'Ocurrió un error al aplazar la fecha fin de la membresía.' });
  }
};

//Controlador para aplazar la membresía desde la app móvil
const aplazarMembresiaOnline = async(req, res) => {
  try{
    const { membresiaId } = req.params; // Obtenemos el _id de la membresía en el URL
    const { plan_id, usuario_id } = req.body; // Obtenemos el id del plan por medio del body

    //Buscamos el usuario por su _id
    const usuario = await User.findById(usuario_id);
    if(!usuario){
      return res.status(400).json({error: 'El usuario no existe'});
    }

    //Buscamos la membresía por su _id
    const membresiaExiste = await Membresia.findById(membresiaId);
    if(!membresiaExiste){
      return res.status(400).json({error: 'La membresía no existe'});
    }

    //Obtener el plan seleccionado
    const planSeleccionado = await plan.findById(plan_id);
    if(!planSeleccionado){
      return res.status(400).json({error: 'El plan seleccionado no existe'});
    }

    const preferenceData = {
      items: [
        {
          title: planSeleccionado.nombre,
          unit_price: planSeleccionado.precio, // Precio del plan
          quantity: 1,
        }
      ],
      payer: {
        email: usuario.email // Email del cliente que pagará
      },
      back_urls: {
        success: "https://gymya-web.onrender.com/src/html/pago_correcto.html",  // Redirige al usuario en caso de éxito
        failure: "https://gymya-web.onrender.com/src/html/pago_incorrecto.html",  // Redirige al usuario en caso de fallo
        pending: "https://gymya-web.onrender.com/src/html/pago_pendiente.html"  // Redirige al usuario en caso de pendiente
      },
      auto_return: "approved",  // Redirige automáticamente si el pago es aprobado
      metadata: { membresiaId, plan_id },
      notification_url: "https://api-gymya-api.onrender.com/api/usuario/pago",  // URL del webhook
      /*
      transfers: [
        {
          // ID de la cuenta de MercadoPago del administrador (quien recibe el 90% del pago)
          collector_id: administrador.mercado_pago_collector_id,  
          amount: planSeleccionado.precio,  // 90% del pago va al administrador
        }
      ],*/
    };

    // Crea la preferencia en MercadoPago
    const response = await preference.create(preferenceData);

    // Enviar la URL de MercadoPago para que el usuario realice el pago
    res.status(200).json({
      init_point: response.body.init_point,
    });
  }catch (error){
    res.status(500).json({ error: 'Ocurrió un error al aplazar la fecha fin de la membresía.' });
  }
};

// Controlador para manejar la notificación del pago (webhook)
const NotificarPago = async(req,res) =>{
  try{
    const payment = req.query;  // Los datos del pago que envía MercadoPago

    if (payment.status === 'approved') {
      // El pago fue aprobado, registrar al usuario usando el servicio existente
      const { membresiaId, plan_id } = payment.metadata;  // Datos del usuario que deberían venir como metadata
    
      // Usar el servicio existente para registrar el nuevo administrador
      const adminPrincipal = await membresiasService.aplazarMembresia(membresiaId, plan_id);
    
      return res.status(201).json({ message: 'Administrador registrado exitosamente', admin: adminPrincipal });
    } else {
      return res.status(400).json({ error: 'El pago no fue aprobado' });
    }
  }catch(error){
    console.error('Error en la notificación de pago:', error);
    res.status(500).json({ error: 'Error al procesar la notificación de pago' });
  }
}

module.exports = { registroUsuario, crearMembresia, getMembresias,  getMembresiasUser, getMembresia, getMembresiasCount, getTotalMembresias, aplazarMembresiaVentanilla, aplazarMembresiaOnline, NotificarPago };