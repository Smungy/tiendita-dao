const express = require('express');
const router = express.Router();
const proveedoresController = require('../controllers/proveedoresController');
const verifyToken = require('../middlewares/authMiddleware');
const { validateProveedor } = require('../middlewares/validators/proveedorValidator');

// todas las rutas están protegidas con verifyToken
router.get('/', verifyToken, proveedoresController.getAllProveedores);
router.get('/:id', verifyToken, proveedoresController.getProveedorById);
router.post('/', verifyToken, validateProveedor, proveedoresController.addProveedor);
router.put('/:id', verifyToken, validateProveedor, proveedoresController.updateProveedor);
router.delete('/:id', verifyToken, proveedoresController.deleteProveedor);

module.exports = router;
