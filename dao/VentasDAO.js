// dao para ventas
const { getConnection } = require("../config/db");
const Venta = require("../models/Venta");
const HistorialVentaCliente = require("../models/HistorialVentaCliente");

class VentasDAO {
  // crear venta y registrar en historial
  async crear(venta) {
    let connection;
    try {
      connection = await getConnection();

      // insertar venta
      const [result] = await connection.execute(
        "INSERT INTO ventas (fecha, total, metodo_pago, cliente_id) VALUES (?, ?, ?, ?)",
        [venta.fecha, venta.total, venta.metodo_pago, venta.cliente_id]
      );
      const ventaId = result.insertId;

      // insertar en historial_ventas_cliente automáticamente
      if (venta.cliente_id) {
        await connection.execute(
          "INSERT INTO historial_ventas_cliente (cliente_id, venta_id, fecha, total) VALUES (?, ?, ?, ?)",
          [venta.cliente_id, ventaId, venta.fecha, venta.total]
        );
      }

      return ventaId;
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  // obtener todas las ventas
  async obtenerTodos() {
    let connection;
    try {
      connection = await getConnection();
      const [rows] = await connection.execute("SELECT * FROM ventas");
      return rows.map(
        (row) =>
          new Venta(
            row.id,
            row.fecha,
            row.total,
            row.metodo_pago,
            row.cliente_id
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

  // obtener venta por id
  async obtenerPorId(id) {
    let connection;
    try {
      connection = await getConnection();
      const [rows] = await connection.execute(
        "SELECT * FROM ventas WHERE id = ?",
        [id]
      );
      if (rows.length === 0) return null;
      const row = rows[0];
      return new Venta(
        row.id,
        row.fecha,
        row.total,
        row.metodo_pago,
        row.cliente_id
      );
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  // actualizar venta
  async actualizar(id, venta) {
    let connection;
    try {
      connection = await getConnection();
      const [result] = await connection.execute(
        "UPDATE ventas SET fecha = ?, total = ?, metodo_pago = ?, cliente_id = ? WHERE id = ?",
        [venta.fecha, venta.total, venta.metodo_pago, venta.cliente_id, id]
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

  // eliminar venta
  async eliminar(id) {
    let connection;
    try {
      connection = await getConnection();
      const [result] = await connection.execute(
        "DELETE FROM ventas WHERE id = ?",
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

  // obtener ventas por fecha
  async obtenerPorFecha(fechaInicio, fechaFin) {
    let connection;
    try {
      connection = await getConnection();
      const [rows] = await connection.execute(
        "SELECT * FROM ventas WHERE fecha BETWEEN ? AND ?",
        [fechaInicio, fechaFin]
      );
      return rows.map(
        (row) =>
          new Venta(
            row.id,
            row.fecha,
            row.total,
            row.metodo_pago,
            row.cliente_id
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

  // obtener historial de cliente
  async obtenerHistorialCliente(cliente_id) {
    let connection;
    try {
      connection = await getConnection();
      const [rows] = await connection.execute(
        "SELECT * FROM historial_ventas_cliente WHERE cliente_id = ?",
        [cliente_id]
      );
      return rows;
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
}

module.exports = { VentasDAO };
