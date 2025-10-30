const dotEnv = require("dotenv");
const express = require("express");
const app = express();

dotEnv.config();

app.use(express.json());

const authRoutes = require("./routes/authRoutes");

app.use("/api/v1/auth", authRoutes);

const protectedRoutes = require("./routes/protectedRoutes");

app.use("/api/v1/protected", protectedRoutes);

const errorHandler = require("./middlewares/errorHandler");

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`El servidor está escuchando en el puerto ${port}`);
});
