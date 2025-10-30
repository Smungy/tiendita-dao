// conexión a la base de datos
const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  waitForConnections: true,
});

async function getConnection() {
  return pool.getConnection();
}

async function closePool() {
  await pool.end();
  console.log("El pool de conexiones se ha cerrado.");
}

module.exports = { getConnection, closePool };
