// dao para historial ventas cliente
const { getConnection } = require("../db");
const HistorialVentaCliente = require("../../models/HistorialVentaCliente");

class HistorialVentasClienteDAO {
  // crear registro en historial
  async crear(historial) {
    let connection;
    try {
      connection = await getConnection();
      const [result] = await connection.execute(
        "INSERT INTO historial_ventas_cliente (cliente_id, venta_id, fecha, total) VALUES (?, ?, ?, ?)",
        [
          historial.cliente_id,
          historial.venta_id,
          historial.fecha,
          historial.total,
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

  // obtener todo el historial
  async obtenerTodos() {
    let connection;
    try {
      connection = await getConnection();
      const [rows] = await connection.execute(
        "SELECT * FROM historial_ventas_cliente"
      );
      return rows.map(
        (row) =>
          new HistorialVentaCliente(
            row.id,
            row.cliente_id,
            row.venta_id,
            row.fecha,
            row.total
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

  // obtener historial por cliente_id
  async obtenerPorClienteId(cliente_id) {
    let connection;
    try {
      connection = await getConnection();
      const [rows] = await connection.execute(
        "SELECT * FROM historial_ventas_cliente WHERE cliente_id = ? ORDER BY fecha DESC",
        [cliente_id]
      );
      return rows.map(
        (row) =>
          new HistorialVentaCliente(
            row.id,
            row.cliente_id,
            row.venta_id,
            row.fecha,
            row.total
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

  // eliminar registro de historial
  async eliminar(id) {
    let connection;
    try {
      connection = await getConnection();
      const [result] = await connection.execute(
        "DELETE FROM historial_ventas_cliente WHERE id = ?",
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

module.exports = { HistorialVentasClienteDAO };
