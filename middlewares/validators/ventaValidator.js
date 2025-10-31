const { body, validationResult } = require("express-validator");

// validaciones para crear y actualizar venta
exports.validateVenta = [
  body("fecha")
    .notEmpty()
    .withMessage("La fecha es requerida")
    .isISO8601()
    .withMessage("La fecha debe estar en formato ISO8601 (YYYY-MM-DD)")
    .toDate(),

  body("total")
    .notEmpty()
    .withMessage("El total es requerido")
    .isNumeric()
    .withMessage("El total debe ser un valor numérico"),

  body("metodo_pago")
    .notEmpty()
    .withMessage("El método de pago es requerido")
    .isLength({ min: 3, max: 50 })
    .withMessage("El método de pago debe tener entre 3 y 50 caracteres")
    .trim(),

  body("cliente_id")
    .notEmpty()
    .withMessage("El ID del cliente es requerido")
    .isNumeric()
    .withMessage("El ID del cliente debe ser un valor numérico"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); 
    }
    next();
  },
];