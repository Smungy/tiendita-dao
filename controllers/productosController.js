const { ProductosDAO } = require("../data/daos/ProductosDAO");
const Producto = require("../models/Producto");

const productosDAO = new ProductosDAO();

// obtener todos los productos
exports.getAllProductos = async (req, res) => {
  try {
    const productos = await productosDAO.obtenerTodos();
    res.json(productos);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "No se pudieron encontrar los productos." });
  }
};

// obtener producto por id
exports.getProductoById = async (req, res) => {
  const productoId = parseInt(req.params.id);

  if (isNaN(productoId)) {
    return res.status(400).json({ error: "El ID del producto no es válido." });
  }

  try {
    const producto = await productosDAO.obtenerPorId(productoId);

    if (!producto) {
      return res.status(404).json({ error: "El producto no fue encontrado." });
    }

    res.json(producto);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "No se pudo obtener el producto." });
  }
};

// agregar producto
exports.addProducto = async (req, res) => {
  try {
    const { nombre, precio, stock, alerta_stock, proveedor_id, proveedor_nombre } = req.body;

    const nuevoProducto = new Producto(
      null,
      nombre,
      precio,
      stock,
      alerta_stock,
      proveedor_id,
      proveedor_nombre
    );

    const productoId = await productosDAO.crear(nuevoProducto);

    res.status(201).json({
      message: "Producto creado exitosamente.",
      productoId: productoId,
    });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "No se pudo agregar el producto." });
  }
};

// actualizar producto
exports.updateProducto = async (req, res) => {
  const productoId = parseInt(req.params.id);

  if (isNaN(productoId)) {
    return res.status(400).json({ error: "El ID del producto no es válido." });
  }

  try {
    const productoExistente = await productosDAO.obtenerPorId(productoId);

    if (!productoExistente) {
      return res.status(404).json({ error: "El producto no fue encontrado." });
    }

    const productoActualizado = new Producto(
      productoId,
      req.body.nombre || productoExistente.nombre,
      req.body.precio || productoExistente.precio,
      req.body.stock || productoExistente.stock,
      req.body.alerta_stock || productoExistente.alerta_stock,
      req.body.proveedor_id || productoExistente.proveedor_id,
      req.body.proveedor_nombre || productoExistente.proveedor_nombre
    );

    await productosDAO.actualizar(productoId, productoActualizado);

    res.json({
      message: "Producto actualizado exitosamente.",
      producto: productoActualizado,
    });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "No se pudo actualizar el producto." });
  }
};

// eliminar producto
exports.deleteProducto = async (req, res) => {
  const productoId = parseInt(req.params.id);

  if (isNaN(productoId)) {
    return res.status(400).json({ error: "El ID del producto no es válido." });
  }

  try {
    const productoExistente = await productosDAO.obtenerPorId(productoId);

    if (!productoExistente) {
      return res.status(404).json({ error: "El producto no fue encontrado." });
    }

    await productosDAO.eliminar(productoId);

    res.status(204).send();
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "No se pudo eliminar el producto." });
  }
};
