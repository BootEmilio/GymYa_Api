const accesosService = require ('../services/accesosService')

const getAllAccesos = async (req, res) => {
    try {
        const accesos = await accesosService.getAllAccesos();
        res.status(200).json(accesos);
    } catch (error){
        console.error('Error al obtener los logs de accesos', error);
        res.status(500).json({error: 'Error al obtener los logs de accesos'});
    }
};

const getAccesosById = async(req, res) =>{
    try {
        const accesos = await accesosService.getAccesosById(req.params.id);
        if (!accesos) return res.status(404).json({error: 'Accesos no encontrado'});
        res.json(accesos);
    } catch (error){
        res.status(500).json({error: 'Error al obtener el accesos solicitado'});
    }
};

module.exports ={
    getAllAccesos,
    getAccesosById
}