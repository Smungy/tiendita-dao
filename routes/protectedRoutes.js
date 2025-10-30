const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");

router.get("/", verifyToken, (req, res) => {
  res.json({ mensaje: "Usted tiene acceso a esta ruta protegida." });
});

module.exports = router;
