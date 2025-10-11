// archivo principal de prueba
const { ProveedoresDAO } = require("./dao/ProveedoresDAO");
const { ProductosDAO } = require("./dao/ProductosDAO");
const { ClientesDAO } = require("./dao/ClientesDAO");
const { VentasDAO } = require("./dao/VentasDAO");
const { DetallesVentaDAO } = require("./dao/DetallesVentaDAO");
const {
  HistorialVentasClienteDAO,
} = require("./dao/HistorialVentasClienteDAO");

console.log("Capa de Acceso a Datos - Tiendita");
console.log("Ejecutar pruebas CRUD completas: node tests/pruebaDAO.js");

// exportar daos para ser usados por la futura api
module.exports = {
  ProveedoresDAO,
  ProductosDAO,
  ClientesDAO,
  VentasDAO,
  DetallesVentaDAO,
  HistorialVentasClienteDAO,
};
