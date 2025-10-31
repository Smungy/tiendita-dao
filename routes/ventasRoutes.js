const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');
const verifyToken = require('../middlewares/authMiddleware');
const { validateVenta } = require('../middlewares/validators/ventaValidator');


router.get('/', verifyToken, ventasController.getAllVentas);
router.get('/:id', verifyToken, ventasController.getVentaById);
router.post('/', verifyToken, validateVenta, ventasController.addVenta); 
router.put('/:id', verifyToken, validateVenta, ventasController.updateVenta); 
router.delete('/:id', verifyToken, ventasController.deleteVenta);

module.exports = router;