// modelo producto
class Producto {
  constructor(
    id,
    nombre,
    precio,
    stock,
    alerta_stock,
    proveedor_id,
    proveedor_nombre
  ) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
    this.alerta_stock = alerta_stock;
    this.proveedor_id = proveedor_id;
    this.proveedor_nombre = proveedor_nombre;
  }
}

module.exports = Producto;
