// dao para clientes
const { getConnection } = require("../db");
const Cliente = require("../../models/Cliente");

class ClientesDAO {
  // crear cliente
  async crear(cliente) {
    let connection;
    try {
      connection = await getConnection();
      const [result] = await connection.execute(
        "INSERT INTO clientes (nombre, telefono) VALUES (?, ?)",
        [cliente.nombre, cliente.telefono]
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

  // obtener todos los clientes
  async obtenerTodos() {
    let connection;
    try {
      connection = await getConnection();
      const [rows] = await connection.execute("SELECT * FROM clientes");
      return rows.map((row) => new Cliente(row.id, row.nombre, row.telefono));
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  // obtener cliente por id
  async obtenerPorId(id) {
    let connection;
    try {
      connection = await getConnection();
      const [rows] = await connection.execute(
        "SELECT * FROM clientes WHERE id = ?",
        [id]
      );
      if (rows.length === 0) return null;
      const row = rows[0];
      return new Cliente(row.id, row.nombre, row.telefono);
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  // actualizar cliente
  async actualizar(id, cliente) {
    let connection;
    try {
      connection = await getConnection();
      const [result] = await connection.execute(
        "UPDATE clientes SET nombre = ?, telefono = ? WHERE id = ?",
        [cliente.nombre, cliente.telefono, id]
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

  // eliminar cliente
  async eliminar(id) {
    let connection;
    try {
      connection = await getConnection();
      const [result] = await connection.execute(
        "DELETE FROM clientes WHERE id = ?",
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

module.exports = { ClientesDAO };
