const adminService = require('../services/adminService');
const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const mercadopago = require('mercadopago');
const { v4: uuidv4 } = require('uuid'); // Para generar ID único de referencia
//const {MercadoPagoConfig, Preference} = require('mercadopago');

/*
// Configurar MercadoPago con tu Access Token (ahora cn el access token de prueba)
const client = new MercadoPagoConfig({access_token: 'APP_USR-806128994004266-031309-e14a1eacf70ca9d5cb3eb38293ea604a-2326694508'});
const preference = new Preference(client);
*/

//Controlador para registrar primer administrador
/*const registro = async (req, res) => {
  try{
    const {username, password, nombre_completo, email, telefono} = req.body;

    // Validar que todos los campos estén presentes
    if (!username || !password || !nombre_completo || !email || !telefono) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Verificar si el username ya existe
    const adminExistente = await Admin.findOne({ username });
    if (adminExistente) {
        return res.status(400).json({ error: 'El nombre de usuario ya está registrado' });
    }

    // Verificar si el email ya existe
    const emailExistente = await Admin.findOne({ email });
    if (emailExistente) {
        return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Verificar si el teléfono ya existe
    const telefonoExistente = await Admin.findOne({ telefono });
    if (telefonoExistente) {
        return res.status(400).json({ error: 'El teléfono ya está registrado' });
    }

    /*
    const preferenceData = {
      items: [
        {
          title: `Pago de registro para ${username}`,
          unit_price: 100.0,  // El costo del registro, por ejemplo, $100
          quantity: 1,
        }
      ],
      payer: {
        email: email,  // Correo del comprador
      },
      back_urls: {
        success: "https://gymya-web.onrender.com/src/html/pago_correcto.html",  // Redirige al usuario en caso de éxito
        failure: "https://gymya-web.onrender.com/src/html/pago_incorrecto.html",  // Redirige al usuario en caso de fallo
        pending: "https://gymya-web.onrender.com/src/html/pago_pendiente.html"  // Redirige al usuario en caso de pendiente
      },
      auto_return: "approved",  // Redirige automáticamente si el pago es aprobado
      metadata: { username, password, nombre_completo, email, telefono },  // Guardar datos para el registro
      notification_url: "https://api-gymya-api.onrender.com/api/admin/pago",  // URL del webhook
    };

    // Crea la preferencia en MercadoPago
    const response = await preference.create(preferenceData);
    */

    // Usar el servicio existente para registrar el nuevo administrador
   /* const adminPrincipal = await adminService.registro(username, password, nombre_completo, email, telefono);

    return res.status(201).json({ message: 'Administrador registrado exitosamente', admin: adminPrincipal });

  }catch (error) {
    console.error('Error en el controlador de registro:', error);
    res.status(500).json({ error: 'Error al registrar el administrador' });
  }
};*/

// Configuración de Mercado Pago
mercadopago.configurations.setAccessToken('TEST-1378290191875758-031219-61e09e114ecad9a4ce02acf1b2a2e1e4-2120356194');

// Controlador para registrar primer administrador
const registro = async (req, res) => {
  try {
    const { username, password, nombre_completo, email, telefono } = req.body;

    // Validar que todos los campos estén presentes
    if (!username || !password || !nombre_completo || !email || !telefono) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Verificar si el username ya existe
    const adminExistente = await Admin.findOne({ username });
    if (adminExistente) {
      return res.status(400).json({ error: 'El nombre de usuario ya está registrado' });
    }

    // Verificar si el email ya existe
    const emailExistente = await Admin.findOne({ email });
    if (emailExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Verificar si el teléfono ya existe
    const telefonoExistente = await Admin.findOne({ telefono });
    if (telefonoExistente) {
      return res.status(400).json({ error: 'El teléfono ya está registrado' });
    }

    // Generar preferencia de pago en Mercado Pago
    const preference = {
      items: [{
        title: "Registro de Administrador GymYa",
        quantity: 1,
        currency_id: "MXN",
        unit_price: 899 // Ajusta el precio
      }],
      payer: {
        email: email
      },
      external_reference: uuidv4(), // ID único para identificar el pago
      back_urls: {
        success: `https://api-gymya-api.onrender.com/api/admin/confirm_payment?email=${email}&username=${username}&password=${password}&nombre_completo=${nombre_completo}&telefono=${telefono}`,
        failure: "https://tupagina.com/fallo",
        pending: "https://tupagina.com/pendiente"
      },
      auto_return: "approved"
    };

    // Crear pago en Mercado Pago
    const response = await mercadopago.preferences.create(preference);

    // Enviar al frontend la URL para el pago
    res.json({ init_point: response.body.init_point });

  } catch (error) {
    console.error('Error en el controlador de registro:', error);
    res.status(500).json({ error: 'Error al generar la preferencia de pago' });
  }
};

// Confirmar el pago y registrar administrador
const confirmPayment = async (req, res) => {
  const { email, username, password, nombre_completo, telefono } = req.query;

  try {
    // Verificar si el pago fue exitoso (puedes verificarlo con la API de Mercado Pago)
    if (req.query.status !== "approved") {
      return res.redirect("https://tupagina.com/error");
    }

    // Crear el administrador en la base de datos después del pago
    const adminPrincipal = await adminService.registro(username, password, nombre_completo, email, telefono);

    res.redirect("https://tupagina.com/registro_exitoso"); // Redirigir a una página de éxito
  } catch (error) {
    console.error('Error al confirmar el pago:', error);
    res.redirect("https://tupagina.com/error");
  }
};


// Controlador para manejar la notificación del pago (webhook)
const NotificacionPago = async (req, res) => {
  try {
    const payment = req.query;  // Los datos del pago que envía MercadoPago

    if (payment.status === 'approved') {
      // El pago fue aprobado, registrar al usuario usando el servicio existente
      const { username, password, nombre_completo, email, telefono } = payment.metadata;  // Datos del usuario que deberían venir como metadata

      // Usar el servicio existente para registrar el nuevo administrador
      const adminPrincipal = await adminService.registro(username, password, nombre_completo, email, telefono);

      return res.status(201).json({ message: 'Administrador registrado exitosamente', admin: adminPrincipal });
    } else {
      return res.status(400).json({ error: 'El pago no fue aprobado' });
    }
  } catch (error) {
    console.error('Error en la notificación de pago:', error);
    res.status(500).json({ error: 'Error al procesar la notificación de pago' });
  }
};

//Controlador para hacer login como administrador
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    //Validar que se pasen los datos
    if (!username || !password) {
      return res.status(400).json({ message: 'Username y contraseña son requeridos' });
    }

    // Buscar el administrador por username
    const admin = await Admin.findOne({ username });  
    if (!admin) {
      throw res.status(400).json({ message: 'Administrador no encontrado'});
    }
     
    // Comparar la contraseña usando bcrypt
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw res.status(400).json({ message: 'Contraseña incorrecta'});
    }

    const authResult = await adminService.authenticateAdmin(admin);

    res.status(200).json({
      message: 'Login exitoso',
      token: authResult.token,
      admin: authResult.admin,
    });
  } catch (error) {
    console.error('Error en el proceso de login del administrador:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { registro, loginAdmin, NotificacionPago, confirmPayment };