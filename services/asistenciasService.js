const QR = require('qrcode');
const Membresia = require('../models/membresias');
//const User = require('../models/usuarios');
//const Plan = require('../models/planes');

//Servicio para generar y mostrar el QR del usuario en su aplicaión móvil
const generarQR = async (usuario_id) => {
    try{
        //Obtenemos la membresía del usuario por medio del usuario_id
        const membresia = await Membresia.findOne({ usuario_id }).populate('plan_id gym_id').exec();

        if (!membresia) {
            throw new Error('No se encontró una membresía para este usuario.');
        }

        //Insertamos los datos que va a llevar el QR
        const DatosQR = {
            membresia_id: membresia._id,
            usuario_id: membresia.usuario_id,
            gym_id: membresia.gym_id,
            plan_id: membresia.plan_id,
            fecha_fin: membresia.fecha_fin
        }

        //Generamos la imagen del QR
        const QRimagen = await QR.toDataURL(JSON.stringify(DatosQR));

        return { codigoQR: QRimagen, membresia };
    }catch(error){
        console.error('Error generando el QR:', error);
        throw error;  // Propagar el error para que sea manejado en la capa superior
    }
};

//Servicio para extraer datos del código QR y registrar así una asistencia (entrada/salida)
const registrarAsistencia = async () => {
    try{

    }catch(error){

    }
};

//Servicio para que el administrador vea las asistencias (paginadas y poder cambiar los días a ver)
const verAsistencias = async () => {
    try{

    }catch(error){

    }
};

//Servicio para que el usuario su última asistencia
const verAsistencia = async () => {
    try{

    }catch(error){

    }
};

//Servicio para que el usuario vea sus asistencias (paginadas y poder cambiar los días a ver)
const verAsistenciasUser = async () => {
    try{

    }catch(error){

    }
};

//Servicio para que el usuario vea cuantos usuarios hay en el gimnasio
const verCantidadAsistencias = async () => {
    try{

    }catch(error){

    }
};

module.exports = { generarQR, registrarAsistencia, verAsistencias, verAsistencia, verAsistenciasUser, verCantidadAsistencias };