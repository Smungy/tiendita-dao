// para probar las operaciones crud
const { ProveedoresDAO } = require("../data/daos/ProveedoresDAO");
const { ProductosDAO } = require("../data/daos/ProductosDAO");
const { ClientesDAO } = require("../data/daos/ClientesDAO");
const { VentasDAO } = require("../data/daos/VentasDAO");
const { DetallesVentaDAO } = require("../data/daos/DetallesVentaDAO");
const {
  HistorialVentasClienteDAO,
} = require("../data/daos/HistorialVentasClienteDAO");
const { closePool } = require("../data/db");

const Proveedor = require("../models/Proveedor");
const Producto = require("../models/Producto");
const Cliente = require("../models/Cliente");
const Venta = require("../models/Venta");
const DetalleVenta = require("../models/DetalleVenta");

const readline = require("readline-sync");

async function pruebasDAO() {
  console.log("=== INICIANDO PRUEBAS DE LA CAPA DAO ===\n");

  try {
    // instanciar daos
    const proveedoresDAO = new ProveedoresDAO();
    const productosDAO = new ProductosDAO();
    const clientesDAO = new ClientesDAO();
    const ventasDAO = new VentasDAO();
    const detallesVentaDAO = new DetallesVentaDAO();
    const historialDAO = new HistorialVentasClienteDAO();

    // ===== PRUEBA 1: PROVEEDORES =====
    console.log("--- PRUEBA 1: PROVEEDORES ---");

    // crear proveedor
    const nuevoProveedor = new Proveedor(
      null,
      "Distribuidora XYZ",
      "Juan Pérez",
      "555-1111",
      "Calle Principal 123"
    );
    const proveedorId = await proveedoresDAO.crear(nuevoProveedor);
    console.log(`✓ Proveedor creado con ID: ${proveedorId}`);

    // leer proveedor
    const proveedor = await proveedoresDAO.obtenerPorId(proveedorId);
    console.log(`✓ Proveedor obtenido:`, proveedor);

    // actualizar proveedor
    proveedor.telefono = "555-2222";
    await proveedoresDAO.actualizar(proveedorId, proveedor);
    console.log(`✓ Proveedor actualizado`);

    // listar proveedores
    const proveedores = await proveedoresDAO.obtenerTodos();
    console.log(`✓ Total de proveedores: ${proveedores.length}\n`);

    // ===== PRUEBA 2: PRODUCTOS =====
    console.log("--- PRUEBA 2: PRODUCTOS ---");

    // crear producto
    const nuevoProducto = new Producto(
      null,
      "Refresco Cola 2L",
      25.5,
      100,
      10,
      proveedorId,
      proveedor.nombre_empresa
    );
    const productoId = await productosDAO.crear(nuevoProducto);
    console.log(`✓ Producto creado con ID: ${productoId}`);

    // leer producto
    const producto = await productosDAO.obtenerPorId(productoId);
    console.log(`✓ Producto obtenido:`, producto);

    // actualizar stock
    await productosDAO.actualizarStock(productoId, 95);
    console.log(`✓ Stock actualizado`);

    // listar productos
    const productos = await productosDAO.obtenerTodos();
    console.log(`✓ Total de productos: ${productos.length}\n`);

    // ===== PRUEBA 3: CLIENTES =====
    console.log("--- PRUEBA 3: CLIENTES ---");

    // crear cliente
    const nuevoCliente = new Cliente(null, "María González", "555-3333");
    const clienteId = await clientesDAO.crear(nuevoCliente);
    console.log(`✓ Cliente creado con ID: ${clienteId}`);

    // leer cliente
    const cliente = await clientesDAO.obtenerPorId(clienteId);
    console.log(`✓ Cliente obtenido:`, cliente);

    // actualizar cliente
    cliente.telefono = "555-4444";
    await clientesDAO.actualizar(clienteId, cliente);
    console.log(`✓ Cliente actualizado`);

    // listar clientes
    const clientes = await clientesDAO.obtenerTodos();
    console.log(`✓ Total de clientes: ${clientes.length}\n`);

    // ===== PRUEBA 4: VENTAS =====
    console.log("--- PRUEBA 4: VENTAS ---");

    // crear venta
    const nuevaVenta = new Venta(null, new Date(), 51.0, "efectivo", clienteId);
    const ventaId = await ventasDAO.crear(nuevaVenta);
    console.log(`✓ Venta creada con ID: ${ventaId}`);

    // leer venta
    const venta = await ventasDAO.obtenerPorId(ventaId);
    console.log(`✓ Venta obtenida:`, venta);

    // listar ventas
    const ventas = await ventasDAO.obtenerTodos();
    console.log(`✓ Total de ventas: ${ventas.length}\n`);

    // ===== PRUEBA 5: DETALLES DE VENTA =====
    console.log("--- PRUEBA 5: DETALLES DE VENTA ---");

    // crear detalle venta
    const nuevoDetalle = new DetalleVenta(
      null,
      ventaId,
      productoId,
      producto.nombre,
      25.5,
      2,
      51.0
    );
    const detalleId = await detallesVentaDAO.crear(nuevoDetalle);
    console.log(`✓ Detalle de venta creado con ID: ${detalleId}`);

    // leer detalles por venta
    const detalles = await detallesVentaDAO.obtenerPorVentaId(ventaId);
    console.log(`✓ Detalles de la venta ${ventaId}:`, detalles);
    console.log(`✓ Total de detalles: ${detalles.length}\n`);

    // ===== PRUEBA 6: HISTORIAL VENTAS CLIENTE =====
    console.log("--- PRUEBA 6: HISTORIAL VENTAS CLIENTE ---");
    const historial = await historialDAO.obtenerPorClienteId(clienteId);
    console.log(`✓ Historial del cliente ${cliente.nombre}:`);
    console.log(`  Total de compras: ${historial.length}`);
    historial.forEach((h) => {
      console.log(
        `  - Venta ID: ${h.venta_id} - Total: $${h.total} - Fecha: ${h.fecha}`
      );
    });
    console.log();

    // ===== PRUEBA 7: ELIMINACIONES (OPCIONAL) =====
    console.log("--- PRUEBA 7: ELIMINACIONES (OPCIONAL) ---");
    const eliminar = readline.question(
      "¿Desea eliminar los registros creados? (s/n): "
    );

    if (eliminar.toLowerCase() === "s") {
      // eliminar detalle
      await detallesVentaDAO.eliminar(detalleId);
      console.log(`✓ Detalle eliminado`);

      // eliminar venta (también elimina historial por CASCADE)
      await ventasDAO.eliminar(ventaId);
      console.log(`✓ Venta eliminada (historial también)`);

      // eliminar producto
      await productosDAO.eliminar(productoId);
      console.log(`✓ Producto eliminado`);

      // eliminar cliente
      await clientesDAO.eliminar(clienteId);
      console.log(`✓ Cliente eliminado`);

      // eliminar proveedor
      await proveedoresDAO.eliminar(proveedorId);
      console.log(`✓ Proveedor eliminado`);
    } else {
      console.log("✓ Registros NO eliminados, permanecen en la BD");
    }

    console.log("\n=== TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE ===");
  } catch (error) {
    console.error("Error en las pruebas:", error.message);
  } finally {
    await closePool();
  }
}

// ejecutar pruebas
pruebasDAO();
