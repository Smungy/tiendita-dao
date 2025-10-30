const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Token no fue proporcionado." });
  }

  try {
    const secretKey = process.env.SECRET_KEY;
    const tokenWithoutBearer = token.split(" ")[1];
    const decoded = jwt.verify(tokenWithoutBearer, secretKey);

    req.usuarioId = decoded.usuarioId;

    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido." });
  }
};

module.exports = verifyToken;
