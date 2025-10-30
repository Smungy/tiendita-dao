const jwt = require("jsonwebtoken");
const { UsuariosDAO } = require("../data/daos/UsuariosDAO");
const Usuario = require("../models/Usuario");

const usuariosDAO = new UsuariosDAO();
const secretKey = process.env.SECRET_KEY;

// login - generar jwt
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const usuario = await usuariosDAO.buscarPorUsername(username);

    if (!usuario || usuario.password != password) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    const token = jwt.sign({ usuarioId: usuario.id }, secretKey, {
      expiresIn: "24h",
    });

    res.json({ token });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "Error al iniciar sesión." });
  }
};

// register - crear nuevo usuario
exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    // validar que los campos no estén vacíos
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username y password son requeridos." });
    }

    // verificar si el usuario ya existe
    const usuarioExistente = await usuariosDAO.buscarPorUsername(username);
    if (usuarioExistente) {
      return res.status(400).json({ error: "El username ya está registrado." });
    }

    // crear nuevo usuario
    const nuevoUsuario = new Usuario(null, username, password);
    const usuarioId = await usuariosDAO.crear(nuevoUsuario);

    res.status(201).json({
      message: "Usuario registrado exitosamente.",
      usuarioId: usuarioId,
    });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "Error al registrar usuario." });
  }
};
