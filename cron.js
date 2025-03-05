// cron.js
const cron = require('node-cron');
const Asistencia = require('./models/asistencias'); // Asegúrate de importar el modelo de Asistencia

// Programar el cron job para ejecutarse cada 15 minutos
cron.schedule('*/10 * * * *', async () => {
    try {
        const AUTO_LOGOUT_TIME = 30 * 60000; // 30 minutos en milisegundos

        // Obtener la fecha y hora actual
        const ahora = new Date();

        // Buscar entradas sin salida en las últimas 3 horas
        const entradasSinSalida = await Asistencia.find({
            tipo_acceso: 'Entrada',
            fecha_hora: { $lte: new Date(ahora.getTime() - AUTO_LOGOUT_TIME) }, // Entradas hace más de 3 horas
            salida_registrada: false // Campo adicional para marcar si se registró una salida
        });

        // Registrar salidas automáticas
        for (const entrada of entradasSinSalida) {
            const fechaSalidaAutomatica = new Date(entrada.fecha_hora.getTime() + AUTO_LOGOUT_TIME);

            await Asistencia.create({
                membresia_id: entrada.membresia_id,
                gym_id: entrada.gym_id,
                tipo_acceso: 'Salida',
                fecha_hora: fechaSalidaAutomatica
            });

            // Marcar la entrada como procesada (opcional)
            entrada.salida_registrada = true;
            await entrada.save();

            console.log('Salida automática registrada para el usuario:', entrada.membresia_id);
        }
    } catch (error) {
        console.error('Error en el cron job de salida automática:', error);
    }
});