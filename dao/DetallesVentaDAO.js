// dao para detallesventa
const { getConnection } = require("../config/db");
const DetalleVenta = require("../models/DetalleVenta");

class DetallesVentaDAO {
  // crear detalle venta
  async crear(detalle) {
    let connection;
    try {
      connection = await getConnection();
      const [result] = await connection.execute(
        "INSERT INTO detalles_venta (venta_id, producto_id, nombre_producto, precio_unitario, cantidad, subtotal) VALUES (?, ?, ?, ?, ?, ?)",
        [
          detalle.venta_id,
          detalle.producto_id,
          detalle.nombre_producto,
          detalle.precio_unitario,
          detalle.cantidad,
          detalle.subtotal,
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  // obtener todos los detalles
  async obtenerTodos() {
    let connection;
    try {
      connection = await getConnection();
      const [rows] = await connection.execute("SELECT * FROM detalles_venta");
      return rows.map(
        (row) =>
          new DetalleVenta(
            row.id,
            row.venta_id,
            row.producto_id,
            row.nombre_producto,
            row.precio_unitario,
            row.cantidad,
            row.subtotal
          )
      );
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  // obtener detalles por venta_id
  async obtenerPorVentaId(venta_id) {
    let connection;
    try {
      connection = await getConnection();
      const [rows] = await connection.execute(
        "SELECT * FROM detalles_venta WHERE venta_id = ?",
        [venta_id]
      );
      return rows.map(
        (row) =>
          new DetalleVenta(
            row.id,
            row.venta_id,
            row.producto_id,
            row.nombre_producto,
            row.precio_unitario,
            row.cantidad,
            row.subtotal
          )
      );
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  // eliminar detalle
  async eliminar(id) {
    let connection;
    try {
      connection = await getConnection();
      const [result] = await connection.execute(
        "DELETE FROM detalles_venta WHERE id = ?",
        [id]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
}

module.exports = { DetallesVentaDAO };
