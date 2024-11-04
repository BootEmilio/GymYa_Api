class User {
  constructor(id, nombre_completo, fecha_registro, telefono, activo, username, password) {
      this.id = id;
      this.nombre_completo = nombre_completo;
      this.fecha_registro = fecha_registro;
      this.telefono = telefono;
      this.activo = activo;
      this.username = username;
      this.password = password; // Si es necesario, puedes manejar el hashing en otro lugar
  }
}

module.exports = User;