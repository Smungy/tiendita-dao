const dotEnv = require("dotenv");
const express = require("express");
const cors = require("cors");
const app = express();

dotEnv.config();

// Configuración de CORS para permitir el frontend
app.use(
  cors({
    origin: "http://localhost:5173", // Puerto de Vite por defecto
    credentials: true,
  })
);

app.use(express.json());

// rutas de autenticación (login y register)
const authRoutes = require("./routes/authRoutes");
app.use("/api/v1/auth", authRoutes);

// ruta de prueba protegida
const protectedRoutes = require("./routes/protectedRoutes");
app.use("/api/v1/protected", protectedRoutes);

// rutas de proveedores (CRUD completo)
const proveedoresRoutes = require("./routes/proveedoresRoutes");
app.use("/api/v1/proveedores", proveedoresRoutes);

// rutas de productos aquí
const productosRoutes = require("./routes/productosRoutes");
app.use("/api/v1/productos", productosRoutes);

// Agregar rutas de clientes aquí
const clientesRoutes = require("./routes/clientesRoutes");
app.use("/api/v1/clientes", clientesRoutes);

// Agregar rutas de ventas aquí
const ventasRoutes = require("./routes/ventasRoutes");
app.use("/api/v1/ventas", ventasRoutes);

// middleware de manejo de errores
const errorHandler = require("./middlewares/errorHandler");

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`El servidor está escuchando en el puerto ${port}`);
});
