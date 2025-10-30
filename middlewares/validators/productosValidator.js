const { body, validationResult } = require('express-validator');

exports.validateProducto = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 100 }).withMessage('El nombre no debe superar los 100 caracteres'),

  body('precio')
    .notEmpty().withMessage('El precio es obligatorio')
    .isFloat({ gt: 0 }).withMessage('El precio debe ser mayor que 0'),

  body('stock')
    .notEmpty().withMessage('El stock es obligatorio')
    .isInt({ min: 0 }).withMessage('El stock debe ser un número entero no negativo'),

  body('alerta_stock')
    .optional()
    .isInt({ min: 0 }).withMessage('La alerta de stock debe ser un número entero no negativo'),

  body('proveedor_id')
    .optional()
    .isInt({ min: 1 }).withMessage('El ID del proveedor debe ser un número entero positivo'),

  body('proveedor_nombre')
    .optional()
    .isLength({ max: 100 }).withMessage('El nombre del proveedor no debe superar los 100 caracteres'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];
