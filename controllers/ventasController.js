const { VentasDAO } = require("../data/daos/VentasDAO");
const Venta = require("../models/Venta");

const ventasDAO = new VentasDAO();

// obtener todas las ventas
exports.getAllVentas = async (req, res) => {
  try {
    const ventas = await ventasDAO.obtenerTodos();
    res.json(ventas); // 200 OK 
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "No se pudieron encontrar las ventas." }); 
  }
};

// obtener venta por id
exports.getVentaById = async (req, res) => {
  const ventaId = parseInt(req.params.id);

  if (isNaN(ventaId)) {
    return res.status(400).json({ error: "El ID de la venta no es válido." }); 
  }

  try {
    const venta = await ventasDAO.obtenerPorId(ventaId);

    if (!venta) {
      return res.status(404).json({ error: "La venta no fue encontrada." }); 
    }

    res.json(venta); 
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "No se pudo obtener la venta." }); 
  }
};

// agregar venta
exports.addVenta = async (req, res) => {
  try {
    const nuevaVenta = new Venta(
      null,
      req.body.fecha,
      req.body.total,
      req.body.metodo_pago,
      req.body.cliente_id
    );

    // El DAO de Ventas se encarga de crear la venta y el historial
    const ventaId = await ventasDAO.crear(nuevaVenta);

    res.status(201).json({ 
      message: "Venta creada exitosamente.",
      ventaId: ventaId,
    });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "No se pudo agregar la venta." }); 
  }
};

// actualizar venta
exports.updateVenta = async (req, res) => {
  const ventaId = parseInt(req.params.id);

  if (isNaN(ventaId)) {
    return res.status(400).json({ error: "El ID de la venta no es válido." }); 
  }

  try {
    const ventaExistente = await ventasDAO.obtenerPorId(ventaId);

    if (!ventaExistente) {
      return res.status(404).json({ error: "La venta no fue encontrada." }); 
    }

    const ventaActualizada = new Venta(
      ventaId,
      req.body.fecha || ventaExistente.fecha,
      req.body.total || ventaExistente.total,
      req.body.metodo_pago || ventaExistente.metodo_pago,
      req.body.cliente_id 
    );

    await ventasDAO.actualizar(ventaId, ventaActualizada);

    res.json({ 
      message: "Venta actualizada exitosamente.",
      venta: ventaActualizada,
    });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "No se pudo actualizar la venta." }); 
  }
};

// eliminar venta
exports.deleteVenta = async (req, res) => {
  const ventaId = parseInt(req.params.id);

  if (isNaN(ventaId)) {
    return res.status(400).json({ error: "El ID de la venta no es válido." }); 
  }

  try {
    const ventaExistente = await ventasDAO.obtenerPorId(ventaId);

    if (!ventaExistente) {
      return res.status(404).json({ error: "La venta no fue encontrada." }); 
    }

    await ventasDAO.eliminar(ventaId);

    res.status(204).send(); 
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "No se pudo eliminar la venta." }); 
  }
};