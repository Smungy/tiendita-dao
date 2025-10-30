const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const { validateProducto } = require('../middlewares/validators/productosValidator');
const productosController = require('../controllers/productosController');

// todas las rutas están protegidas con verifyToken
router.get('/', verifyToken, productosController.getAllProductos);
router.get('/:id', verifyToken, productosController.getProductoById);
router.post('/', verifyToken, validateProducto, productosController.addProducto);
router.put('/:id', verifyToken, validateProducto, productosController.updateProducto);
router.delete('/:id', verifyToken, productosController.deleteProducto);

module.exports = router;
