const { body, validationResult } = require('express-validator');

exports.validateCliente = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 100 }).withMessage('El nombre no debe superar los 100 caracteres'),

  body('telefono')
    .notEmpty().withMessage('El telefono es obligatorio')
    .isFloat({ max: 20 }).withMessage('El numero de telefono debe ser valido'),

  body('direccion')
    .notEmpty().withMessage('La direccion es obligatoria')
    .isInt({ mmax: 100 }).withMessage('La direccion no debe superar los 100 caracteres'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];