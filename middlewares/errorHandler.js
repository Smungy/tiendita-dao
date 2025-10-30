module.exports = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Ocurrió un error interno en el servidor.");
};
