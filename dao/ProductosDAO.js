// dao para productos
const { getConnection } = require("../config/db");
const Producto = require("../models/Producto");

class ProductosDAO {
  // crear producto
  async crear(producto) {
    let connection;
    try {
      connection = await getConnection();
      const [result] = await connection.execute(
        "INSERT INTO productos (nombre, precio, stock, alerta_stock, proveedor_id, proveedor_nombre) VALUES (?, ?, ?, ?, ?, ?)",
        [
          producto.nombre,
          producto.precio,
          producto.stock,
          producto.alerta_stock,
          producto.proveedor_id,
          producto.proveedor_nombre,
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

  // obtener todos los productos
  async obtenerTodos() {
    let connection;
    try {
      connection = await getConnection();
      const [rows] = await connection.execute("SELECT * FROM productos");
      return rows.map(
        (row) =>
          new Producto(
            row.id,
            row.nombre,
            row.precio,
            row.stock,
            row.alerta_stock,
            row.proveedor_id,
            row.proveedor_nombre
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

  // obtener producto por id
  async obtenerPorId(id) {
    let connection;
    try {
      connection = await getConnection();
      const [rows] = await connection.execute(
        "SELECT * FROM productos WHERE id = ?",
        [id]
      );
      if (rows.length === 0) return null;
      const row = rows[0];
      return new Producto(
        row.id,
        row.nombre,
        row.precio,
        row.stock,
        row.alerta_stock,
        row.proveedor_id,
        row.proveedor_nombre
      );
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  // actualizar producto
  async actualizar(id, producto) {
    let connection;
    try {
      connection = await getConnection();
      const [result] = await connection.execute(
        "UPDATE productos SET nombre = ?, precio = ?, stock = ?, alerta_stock = ?, proveedor_id = ?, proveedor_nombre = ? WHERE id = ?",
        [
          producto.nombre,
          producto.precio,
          producto.stock,
          producto.alerta_stock,
          producto.proveedor_id,
          producto.proveedor_nombre,
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

  // eliminar producto
  async eliminar(id) {
    let connection;
    try {
      connection = await getConnection();
      const [result] = await connection.execute(
        "DELETE FROM productos WHERE id = ?",
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

  // actualizar stock
  async actualizarStock(id, nuevoStock) {
    let connection;
    try {
      connection = await getConnection();
      const [result] = await connection.execute(
        "UPDATE productos SET stock = ? WHERE id = ?",
        [nuevoStock, id]
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

module.exports = { ProductosDAO };
