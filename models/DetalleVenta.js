// modelo detalleventa
class DetalleVenta {
  constructor(
    id,
    venta_id,
    producto_id,
    nombre_producto,
    precio_unitario,
    cantidad,
    subtotal
  ) {
    this.id = id;
    this.venta_id = venta_id;
    this.producto_id = producto_id;
    this.nombre_producto = nombre_producto;
    this.precio_unitario = precio_unitario;
    this.cantidad = cantidad;
    this.subtotal = subtotal;
  }
}

module.exports = DetalleVenta;
