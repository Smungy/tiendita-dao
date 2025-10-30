// dao para proveedores
const { getConnection } = require("../db");
const Proveedor = require("../../models/Proveedor");

class ProveedoresDAO {
  // crear proveedor
  async crear(proveedor) {
    let connection;
    try {
      connection = await getConnection();
      const [result] = await connection.execute(
        "INSERT INTO proveedores (nombre_empresa, contacto_nombre, telefono, direccion) VALUES (?, ?, ?, ?)",
        [
          proveedor.nombre_empresa,
          proveedor.contacto_nombre,
          proveedor.telefono,
          proveedor.direccion,
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

  // obtener todos los proveedores
  async obtenerTodos() {
    let connection;
    try {
      connection = await getConnection();
      const [rows] = await connection.execute("SELECT * FROM proveedores");
      return rows.map(
        (row) =>
          new Proveedor(
            row.id,
            row.nombre_empresa,
            row.contacto_nombre,
            row.telefono,
            row.direccion
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

  // obtener proveedor por id
  async obtenerPorId(id) {
    let connection;
    try {
      connection = await getConnection();
      const [rows] = await connection.execute(
        "SELECT * FROM proveedores WHERE id = ?",
        [id]
      );
      if (rows.length === 0) return null;
      const row = rows[0];
      return new Proveedor(
        row.id,
        row.nombre_empresa,
        row.contacto_nombre,
        row.telefono,
        row.direccion
      );
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  // actualizar proveedor
  async actualizar(id, proveedor) {
    let connection;
    try {
      connection = await getConnection();
      const [result] = await connection.execute(
        "UPDATE proveedores SET nombre_empresa = ?, contacto_nombre = ?, telefono = ?, direccion = ? WHERE id = ?",
        [
          proveedor.nombre_empresa,
          proveedor.contacto_nombre,
          proveedor.telefono,
          proveedor.direccion,
          id,
        ]
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

  // eliminar proveedor
  async eliminar(id) {
    let connection;
    try {
      connection = await getConnection();
      const [result] = await connection.execute(
        "DELETE FROM proveedores WHERE id = ?",
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

module.exports = { ProveedoresDAO };
