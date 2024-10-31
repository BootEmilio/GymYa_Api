class Client {
    constructor(id_cliente, nombre, apellido, contacto, email, fecha_registro, imagen) {
      this.id_cliente = id_cliente;
      this.nombre = nombre;
      this.apellido = apellido;
      this.contacto = contacto;
      this.email = email;
      this.fecha_registro = fecha_registro;
      this.imagen = imagen;
    }
  }
  
  module.exports = Client;
  