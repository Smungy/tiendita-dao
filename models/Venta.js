// modelo venta
class Venta {
  constructor(id, fecha, total, metodo_pago, cliente_id) {
    this.id = id;
    this.fecha = fecha;
    this.total = total;
    this.metodo_pago = metodo_pago;
    this.cliente_id = cliente_id;
  }
}

module.exports = Venta;
