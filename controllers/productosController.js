const { getConnection } = require('../data/db');

// obtener todos los productos
exports.getAllProductos = async (req, res) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query('SELECT * FROM productos');
    conn.release();
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
};

// obtener producto por ID
exports.getProductoById = async (req, res) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query('SELECT * FROM productos WHERE id = ?', [req.params.id]);
    conn.release();
    if (rows.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el producto' });
  }
};

// agregar nuevo producto
exports.addProducto = async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body;
    const conn = await getConnection();
    const [result] = await conn.query(
      'INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)',
      [nombre, precio, stock]
    );
    conn.release();
    res.status(201).json({ id: result.insertId, nombre, precio, stock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar el producto' });
  }
};

// actualizar producto
exports.updateProducto = async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body;
    const conn = await getConnection();
    const [result] = await conn.query(
      'UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?',
      [nombre, precio, stock, req.params.id]
    );
    conn.release();
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    res.status(200).json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
};

// eliminar producto
exports.deleteProducto = async (req, res) => {
  try {
    const conn = await getConnection();
    const [result] = await conn.query('DELETE FROM productos WHERE id = ?', [req.params.id]);
    conn.release();
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
};
