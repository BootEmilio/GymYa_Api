class Gimnasio {
    constructor(id_gym, codigo_gym, nombre, pais, estado, ciudad, direccion, codigoPostal, rfc, imagen) {
        this.id_gym = id_gym;
        this.codigo_gym = codigo_gym;
        this.nombre = nombre;
        this.pais = pais;
        this.estado = estado;
        this.ciudad = ciudad;
        this.direccion = direccion;
        this.codigoPostal = codigoPostal;
        this.rfc = rfc;
        this.imagen = imagen;
    }
}

module.exports = Gimnasio;
