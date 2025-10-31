const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');
const verifyToken = require('../middlewares/authMiddleware');
const { validateCliente } = require('../middlewares/validators/clienteValidator');

// todas las rutas están protegidas con verifyToken
router.get('/', verifyToken, clientesController.getAllClientes);
router.get('/:id', verifyToken, clientesController.getClienteById);
router.post('/', verifyToken, validateCliente, clientesController.addCliente);
router.put('/:id', verifyToken, validateCliente, clientesController.updateCliente);
router.delete('/:id', verifyToken, clientesController.deleteCliente);

module.exports = router;