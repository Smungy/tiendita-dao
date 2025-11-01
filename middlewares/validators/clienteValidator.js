const { body, validationResult } = require("express-validator");

exports.validateCliente = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 100 }).withMessage('El nombre no debe superar los 100 caracteres'),

    body('telefono')
    .notEmpty()
    .withMessage('El teléfono es obligatorio')
    .matches(/^\d{10}$/) // Usa una RegEx para asegurar 10 dígitos
    .withMessage('El teléfono debe tener exactamente 10 dígitos')
    .trim(),

    (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];