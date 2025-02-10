const asistenciasService = require('../services/asistenciasService');

//Controlador para generar y mostrar el QR del usuario en su aplicaión móvil
const generarQR = async(req, res) => {
    try{
        const { id: usuario_id } = req.user || {}; //Obtenemos el _id del token del usuario
        if(!usuario_id){
            return res.status(400).json({ error: 'No se encontró el usuario en la solicitud.' });
        }

        const QR = await asistenciasService.generarQR(usuario_id);

        res.status(201).json(QR);
    }catch (error){
        console.error('Error al generar el código QR:', error);
        res.status(500).json({ error: 'Ocurrió un error al generar su código QR.' });
    }
};

module.exports = { generarQR };
