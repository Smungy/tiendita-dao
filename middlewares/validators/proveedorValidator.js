const { body, validationResult } = require("express-validator");

// validaciones para crear y actualizar proveedor
exports.validateProveedor = [
  body("nombre_empresa")
    .notEmpty()
    .withMessage("El nombre de la empresa es requerido")
    .isLength({ min: 3 })
    .withMessage("El nombre de la empresa debe tener al menos 3 caracteres")
    .isLength({ max: 100 })
    .withMessage("El nombre de la empresa no puede exceder 100 caracteres")
    .trim(),

  body("contacto_nombre")
    .notEmpty()
    .withMessage("El nombre del contacto es requerido")
    .isLength({ min: 3 })
    .withMessage("El nombre del contacto debe tener al menos 3 caracteres")
    .isLength({ max: 100 })
    .withMessage("El nombre del contacto no puede exceder 100 caracteres")
    .trim(),

  body("telefono")
    .notEmpty()
    .withMessage("El teléfono es requerido")
    .matches(/^\d{10}$/)
    .withMessage("El teléfono debe tener exactamente 10 dígitos")
    .trim(),

  body("direccion")
    .notEmpty()
    .withMessage("La dirección es requerida")
    .isLength({ min: 5 })
    .withMessage("La dirección debe tener al menos 5 caracteres")
    .isLength({ max: 200 })
    .withMessage("La dirección no puede exceder 200 caracteres")
    .trim(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
