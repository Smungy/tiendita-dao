const { ProveedoresDAO } = require("../data/daos/ProveedoresDAO");
const Proveedor = require("../models/Proveedor");

const proveedoresDAO = new ProveedoresDAO();

// obtener todos los proveedores
exports.getAllProveedores = async (req, res) => {
  try {
    const proveedores = await proveedoresDAO.obtenerTodos();
    res.json(proveedores);
  } catch (err) {
    console.error(err.stack);
    res
      .status(500)
      .json({ error: "No se pudieron encontrar los proveedores." });
  }
};

// obtener proveedor por id
exports.getProveedorById = async (req, res) => {
  const proveedorId = parseInt(req.params.id);

  if (isNaN(proveedorId)) {
    return res.status(400).json({ error: "El ID del proveedor no es válido." });
  }

  try {
    const proveedor = await proveedoresDAO.obtenerPorId(proveedorId);

    if (!proveedor) {
      return res.status(404).json({ error: "El proveedor no fue encontrado." });
    }

    res.json(proveedor);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "No se pudo obtener el proveedor." });
  }
};

// agregar proveedor
exports.addProveedor = async (req, res) => {
  try {
    const nuevoProveedor = new Proveedor(
      null,
      req.body.nombre_empresa,
      req.body.contacto_nombre,
      req.body.telefono,
      req.body.direccion
    );

    const proveedorId = await proveedoresDAO.crear(nuevoProveedor);

    res.status(201).json({
      message: "Proveedor creado exitosamente.",
      proveedorId: proveedorId,
    });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "No se pudo agregar el proveedor." });
  }
};

// actualizar proveedor
exports.updateProveedor = async (req, res) => {
  const proveedorId = parseInt(req.params.id);

  if (isNaN(proveedorId)) {
    return res.status(400).json({ error: "El ID del proveedor no es válido." });
  }

  try {
    const proveedorExistente = await proveedoresDAO.obtenerPorId(proveedorId);

    if (!proveedorExistente) {
      return res.status(404).json({ error: "El proveedor no fue encontrado." });
    }

    const proveedorActualizado = new Proveedor(
      proveedorId,
      req.body.nombre_empresa || proveedorExistente.nombre_empresa,
      req.body.contacto_nombre || proveedorExistente.contacto_nombre,
      req.body.telefono || proveedorExistente.telefono,
      req.body.direccion || proveedorExistente.direccion
    );

    await proveedoresDAO.actualizar(proveedorId, proveedorActualizado);

    res.json({
      message: "Proveedor actualizado exitosamente.",
      proveedor: proveedorActualizado,
    });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "No se pudo actualizar el proveedor." });
  }
};

// eliminar proveedor
exports.deleteProveedor = async (req, res) => {
  const proveedorId = parseInt(req.params.id);

  if (isNaN(proveedorId)) {
    return res.status(400).json({ error: "El ID del proveedor no es válido." });
  }

  try {
    const proveedorExistente = await proveedoresDAO.obtenerPorId(proveedorId);

    if (!proveedorExistente) {
      return res.status(404).json({ error: "El proveedor no fue encontrado." });
    }

    await proveedoresDAO.eliminar(proveedorId);

    res.status(204).send();
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "No se pudo eliminar el proveedor." });
  }
};
