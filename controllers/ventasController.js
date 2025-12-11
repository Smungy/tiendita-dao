const { VentasDAO } = require("../data/daos/VentasDAO");
const { DetallesVentaDAO } = require("../data/daos/DetallesVentaDAO");
const Venta = require("../models/Venta");
const DetalleVenta = require("../models/DetalleVenta");

const ventasDAO = new VentasDAO();
const detallesVentaDAO = new DetallesVentaDAO();

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
  const { getConnection } = require("../data/db");
  let connection;
  
  try {
    // Validar datos requeridos
    if (!req.body.total || req.body.total <= 0) {
      return res.status(400).json({ error: "El total de la venta es requerido y debe ser mayor a 0." });
    }
    
    if (!req.body.metodo_pago) {
      return res.status(400).json({ error: "El método de pago es requerido." });
    }

    connection = await getConnection();
    await connection.beginTransaction();

    // Formatear fecha correctamente para MySQL (YYYY-MM-DD HH:MM:SS)
    let fechaVenta = req.body.fecha;
    if (fechaVenta) {
      try {
        const fecha = new Date(fechaVenta);
        if (isNaN(fecha.getTime())) {
          fechaVenta = null; // Usará CURRENT_TIMESTAMP de MySQL
        } else {
          // Convertir a formato MySQL: YYYY-MM-DD HH:MM:SS
          const year = fecha.getFullYear();
          const month = String(fecha.getMonth() + 1).padStart(2, '0');
          const day = String(fecha.getDate()).padStart(2, '0');
          const hours = String(fecha.getHours()).padStart(2, '0');
          const minutes = String(fecha.getMinutes()).padStart(2, '0');
          const seconds = String(fecha.getSeconds()).padStart(2, '0');
          fechaVenta = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }
      } catch (e) {
        fechaVenta = null; // Usará CURRENT_TIMESTAMP de MySQL
      }
    } else {
      fechaVenta = null; // Usará CURRENT_TIMESTAMP de MySQL
    }
    
    // Crear la venta
    const nuevaVenta = new Venta(
      null,
      fechaVenta,
      parseFloat(req.body.total),
      req.body.metodo_pago,
      req.body.cliente_id ? parseInt(req.body.cliente_id) : null
    );

    console.log("Creando venta con fecha:", nuevaVenta.fecha);

    // Insertar venta
    const [result] = await connection.execute(
      fechaVenta 
        ? "INSERT INTO ventas (fecha, total, metodo_pago, cliente_id) VALUES (?, ?, ?, ?)"
        : "INSERT INTO ventas (total, metodo_pago, cliente_id) VALUES (?, ?, ?)",
      fechaVenta
        ? [fechaVenta, nuevaVenta.total, nuevaVenta.metodo_pago, nuevaVenta.cliente_id]
        : [nuevaVenta.total, nuevaVenta.metodo_pago, nuevaVenta.cliente_id]
    );
    const ventaId = result.insertId;

    // Insertar en historial_ventas_cliente si hay cliente
    if (nuevaVenta.cliente_id) {
      await connection.execute(
        fechaVenta
          ? "INSERT INTO historial_ventas_cliente (cliente_id, venta_id, fecha, total) VALUES (?, ?, ?, ?)"
          : "INSERT INTO historial_ventas_cliente (cliente_id, venta_id, total) VALUES (?, ?, ?)",
        fechaVenta
          ? [nuevaVenta.cliente_id, ventaId, fechaVenta, nuevaVenta.total]
          : [nuevaVenta.cliente_id, ventaId, nuevaVenta.total]
      );
    }

    // Crear detalles de venta y actualizar stock si hay productos
    console.log("Productos recibidos:", req.body.productos);
    if (req.body.productos && Array.isArray(req.body.productos) && req.body.productos.length > 0) {
      console.log(`Procesando ${req.body.productos.length} productos`);
      for (const producto of req.body.productos) {
        console.log("Procesando producto:", producto);
        
        // Validar que el producto tenga los datos necesarios
        if (!producto.producto_id || !producto.cantidad || !producto.precio_unitario) {
          console.error("Producto inválido:", producto);
          throw new Error(`Producto inválido: faltan datos requeridos (producto_id: ${producto.producto_id}, cantidad: ${producto.cantidad}, precio_unitario: ${producto.precio_unitario})`);
        }
        
        // Crear detalle de venta
        const detalle = new DetalleVenta(
          null,
          ventaId,
          parseInt(producto.producto_id),
          producto.nombre_producto || "Producto sin nombre",
          parseFloat(producto.precio_unitario),
          parseInt(producto.cantidad),
          parseFloat(producto.subtotal || (producto.precio_unitario * producto.cantidad))
        );

        await connection.execute(
          "INSERT INTO detalles_venta (venta_id, producto_id, nombre_producto, precio_unitario, cantidad, subtotal) VALUES (?, ?, ?, ?, ?, ?)",
          [
            detalle.venta_id,
            detalle.producto_id,
            detalle.nombre_producto,
            detalle.precio_unitario,
            detalle.cantidad,
            detalle.subtotal
          ]
        );

        // Obtener stock actual del producto usando la misma conexión
        const [productoRows] = await connection.execute(
          "SELECT stock FROM productos WHERE id = ?",
          [producto.producto_id]
        );

        if (productoRows.length > 0) {
          const stockActual = productoRows[0].stock;
          const nuevoStock = stockActual - producto.cantidad;
          
          console.log(`Actualizando stock producto ${producto.producto_id}: ${stockActual} -> ${nuevoStock >= 0 ? nuevoStock : 0}`);
          
          // Actualizar stock del producto
          await connection.execute(
            "UPDATE productos SET stock = ? WHERE id = ?",
            [nuevoStock >= 0 ? nuevoStock : 0, producto.producto_id]
          );
        } else {
          console.log(`Producto ${producto.producto_id} no encontrado`);
        }
      }
    }

    await connection.commit();

    res.status(201).json({ 
      message: "Venta creada exitosamente.",
      ventaId: ventaId,
    });
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error al crear venta:", err);
    console.error("Stack:", err.stack);
    res.status(500).json({ 
      error: "No se pudo agregar la venta.",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }); 
  } finally {
    if (connection) {
      connection.release();
    }
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

// obtener detalles de venta por venta_id
exports.getDetallesVenta = async (req, res) => {
  const ventaId = parseInt(req.params.id);

  if (isNaN(ventaId)) {
    return res.status(400).json({ error: "El ID de la venta no es válido." }); 
  }

  try {
    const detalles = await detallesVentaDAO.obtenerPorVentaId(ventaId);
    res.json(detalles); 
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "No se pudieron obtener los detalles de la venta." }); 
  }
};