// modelo historial venta cliente
class HistorialVentaCliente {
  constructor(id, cliente_id, venta_id, fecha, total) {
    this.id = id;
    this.cliente_id = cliente_id;
    this.venta_id = venta_id;
    this.fecha = fecha;
    this.total = total;
  }
}

module.exports = HistorialVentaCliente;
