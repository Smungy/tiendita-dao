const dotEnv = require("dotenv");
const express = require("express");
const cors = require("cors");
const app = express();

dotEnv.config();

// Configuración de CORS para permitir el frontend
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // Permitir ambos orígenes
    credentials: true,
  })
);

app.use(express.json());

// Servir archivos estáticos desde la carpeta public
app.use(express.static("public"));

// Ruta raíz para servir index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

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

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`El servidor está escuchando en el puerto ${port}`);
  console.log(`Abre tu navegador en: http://localhost:${port}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`El puerto ${port} ya está en uso. Intenta con otro puerto.`);
  } else {
    console.error('Error al iniciar el servidor:', err);
  }
  process.exit(1);
});
