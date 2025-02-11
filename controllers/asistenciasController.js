const asistenciasService = require('../services/asistenciasService');

//Controlador para que el registre las entradas y salidas (por ahora por medio de peticiones, cambiar para registro de QR)
const registrarAsistencia = async (req, res) => {
    try{
        const { membresia_id, fecha_fin } = req.body; //Obtener los datos de la petición

        //Validar que se pasaron todos los datos
        if(!membresia_id || !fecha_fin) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const nuevaAsistencia = await asistenciasService.registrarAsistencia(membresia_id, fecha_fin);

        res.status(201).json(nuevaAsistencia);
    }catch(error){
        res.status(500).json({error: 'Error al registrar el usuario junto a su membresía'});
    }
}

//Controlador para que el admin vea las asistencias del día u otra fecha
const verAsistencias = async (req, res) => {
    try{
        const gym_id = req.user.gym_id; //Obtiene el gym_id por medio de su token
        const {fecha, search} = req.query; //Obtenemos la busqueda por medio de la URL

        const asistencias = await asistenciasService.verAsistencias(gym_id, fecha, search);

        res.status(200).json({
            success: true,
            message: 'Asistencias obtenidas correctamente',
            asistencias: asistencias
        });
    }catch (error){
        console.error('Error en obtener las asistencias:', error);
        res.status(500).json({ error: 'Ocurrió un error al obtener las asistencias.' });
    }
};

module.exports = { registrarAsistencia,verAsistencias };
