const { ClientesDAO } = require("../data/daos/ClientesDAO");
const Proveedor = require("../models/Cliente");

const clientesDAO = new ClientesDAO();

// obtener todos los clientes
exports.getAllClientes = async (req, res) => {
  try {
    const clientes = await clientesDAO.obtenerTodos();
    res.json(clientes);
  } catch (err) {
    console.error(err.stack);
    res
      .status(500)
      .json({ error: "No se pudieron encontrar los clientes." });
  }
};

// obtener cliente por id
exports.getClienteById = async (req, res) => {
  const clienteId = parseInt(req.params.id);

  if (isNaN(clienteId)) {
    return res.status(400).json({ error: "El ID del cliente no es válido." });
  }

  try {
    const cliente = await clientesDAO.obtenerPorId(clienteId);

    if (!cliente) {
      return res.status(404).json({ error: "El cliente no fue encontrado." });
    }

    res.json(cliente);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "No se pudo obtener el cliente." });
  }
};

// agregar cliente
exports.addCliente = async (req, res) => {
  try {
    const nuevoCliente = new Cliente(
      null,
      req.body.id,
      req.body.contacto_nombre,
      req.body.telefono
      
    );

    const clienteId = await clientesDAO.crear(nuevoCliente);

    res.status(201).json({
      message: "Cliente creado exitosamente.",
      proveedorId: clienteId,
    });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "No se pudo agregar el cliente." });
  }
};

// actualizar cliente
exports.updateCliente = async (req, res) => {
  const clienteId = parseInt(req.params.id);

  if (isNaN(clienteId)) {
    return res.status(400).json({ error: "El ID del cliente no es válido." });
  }

  try {
    const clienteExistente = await clientesDAO.obtenerPorId(clienteId);

    if (!clienteExistente) {
      return res.status(404).json({ error: "El cliente no fue encontrado." });
    }

    const clienteActualizado = new Proveedor(
      clienteId,
      req.body.id || clienteExistente.id,
      req.body.contacto_nombre || clienteExistente.contacto_nombre,
      req.body.telefono || clienteExistente.telefono
      
    );

    await clientesDAO.actualizar(clienteId, clienteActualizado);

    res.json({
      message: "Cliente actualizado exitosamente.",
      cliente: clienteActualizado,
    });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "No se pudo actualizar el cliente." });
  }
};

// eliminar cliente
exports.deleteCliente = async (req, res) => {
  const clienteId = parseInt(req.params.id);

  if (isNaN(clienteId)) {
    return res.status(400).json({ error: "El ID del cliente no es válido." });
  }

  try {
    const clienteExistente = await clientesDAO.obtenerPorId(clienteId);

    if (!clienteExistente) {
      return res.status(404).json({ error: "El cliente no fue encontrado." });
    }

    await clientesDAO.eliminar(clienteId);

    res.status(204).send();
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "No se pudo eliminar el cliente." });
  }
};