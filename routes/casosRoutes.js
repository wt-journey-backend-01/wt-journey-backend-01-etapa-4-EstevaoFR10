const express = require('express');
const router = express.Router();
const casosController = require('../controllers/casosController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas protegidas para casos
router.get('/', authMiddleware, casosController.getAllCasos);
router.get('/:caso_id/agente', authMiddleware, casosController.getAgenteDoCaso);
router.get('/:id', authMiddleware, casosController.getCasoById);
router.post('/', authMiddleware, casosController.createCaso);
router.put('/:id', authMiddleware, casosController.updateCasoPUT);
router.patch('/:id', authMiddleware, casosController.updateCaso);
router.delete('/:id', authMiddleware, casosController.deleteCaso);

module.exports = router;
