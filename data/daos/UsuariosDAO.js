// dao para usuarios
const { getConnection } = require("../db");
const Usuario = require("../../models/Usuario");

class UsuariosDAO {
  // buscar usuario por username
  async buscarPorUsername(username) {
    let connection;
    try {
      connection = await getConnection();
      const [rows] = await connection.execute(
        "SELECT * FROM usuarios WHERE username = ?",
        [username]
      );
      if (rows.length === 0) {
        return null;
      }
      const row = rows[0];
      return new Usuario(row.id, row.username, row.password);
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  // crear usuario
  async crear(usuario) {
    let connection;
    try {
      connection = await getConnection();
      const [result] = await connection.execute(
        "INSERT INTO usuarios (username, password) VALUES (?, ?)",
        [usuario.username, usuario.password]
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

  // obtener todos los usuarios
  async obtenerTodos() {
    let connection;
    try {
      connection = await getConnection();
      const [rows] = await connection.execute("SELECT * FROM usuarios");
      return rows.map((row) => new Usuario(row.id, row.username, row.password));
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  // obtener usuario por id
  async obtenerPorId(id) {
    let connection;
    try {
      connection = await getConnection();
      const [rows] = await connection.execute(
        "SELECT * FROM usuarios WHERE id = ?",
        [id]
      );
      if (rows.length === 0) {
        return null;
      }
      const row = rows[0];
      return new Usuario(row.id, row.username, row.password);
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  // actualizar usuario
  async actualizar(id, usuario) {
    let connection;
    try {
      connection = await getConnection();
      await connection.execute(
        "UPDATE usuarios SET username = ?, password = ? WHERE id = ?",
        [usuario.username, usuario.password, id]
      );
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  // eliminar usuario
  async eliminar(id) {
    let connection;
    try {
      connection = await getConnection();
      await connection.execute("DELETE FROM usuarios WHERE id = ?", [id]);
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
}

module.exports = { UsuariosDAO };
