class Accesos {
    constructor (id, id_cliente, fecha_hora_acceso, tipo_acceso){
        this.id = id;
        this.id_cliente = id_cliente;
        this.fecha_hora_acceso = fecha_hora_acceso;
        this.tipo_acceso = tipo_acceso;
    }
}

module.exports = Accesos;