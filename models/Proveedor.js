// modelo proveedor
class Proveedor {
  constructor(id, nombre_empresa, contacto_nombre, telefono, direccion) {
    this.id = id;
    this.nombre_empresa = nombre_empresa;
    this.contacto_nombre = contacto_nombre;
    this.telefono = telefono;
    this.direccion = direccion;
  }
}

module.exports = Proveedor;
