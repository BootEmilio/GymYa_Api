const express = require('express');
const asistenciasController = require('../controllers/asistenciasController');
const token = require('../middlewares/authMiddleware');
const router = express.Router();

//Ruta para registrar entradas y salidas
router.post('/:gymId/nuevaAsistencia', token, asistenciasController.registrarAsistencia);
//Ruta para ver las entradas y salidas del gimnasio
router.get('/:gymId/asistencias', token, asistenciasController.verAsistencias);
//Ruta para ver los activos
router.get('/:gymId/activos', token, asistenciasController.verActivos);
//Ruta para ver la última entrada del usuario
router.get('/:membresiaId/ultimaAsistencia', token, asistenciasController.verAsistencia);
//Ruta para ver las entradas y salidas de un usuario
router.get('/:membresiaId/asistenciasUser', token, asistenciasController.verAsistenciasUser);
//Ruta para contar los usuarios que hay dentro del gimnasio ahora
router.get('/:gymId/contarAsistencias', token, asistenciasController.contarAsistencias); 

router.get('/api/membresias/distribucion-planes', token, async (req, res) => {
    try {
        const { gymId } = req.query;
        
        if (!gymId) {
            return res.status(400).json({ error: 'Se requiere el parámetro gymId' });
        }

        const distribucion = await Membresia.aggregate([
            {
                $match: {
                    gym_id: mongoose.Types.ObjectId(gymId),
                    estado: 'activa'
                }
            },
            {
                $group: {
                    _id: "$plan_id",
                    cantidad: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "planes",
                    localField: "_id",
                    foreignField: "_id",
                    as: "plan"
                }
            },
            {
                $unwind: "$plan"
            },
            {
                $project: {
                    nombre: "$plan.nombre",
                    cantidad: 1,
                    _id: 0
                }
            },
            {
                $sort: { cantidad: -1 }
            }
        ]);

        res.status(200).json({
            planes: distribucion
        });
        
    } catch (error) {
        console.error('Error al obtener distribución de planes:', error);
        res.status(500).json({ error: 'Error al obtener distribución de planes' });
    }
});

module.exports = router;
