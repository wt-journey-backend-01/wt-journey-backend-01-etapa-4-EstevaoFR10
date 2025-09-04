const express = require('express');
const router = express.Router();
const agentesController = require('../controllers/agentesController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas protegidas para agentes
router.get('/', authMiddleware, agentesController.getAllAgentes);
router.get('/:id', authMiddleware, agentesController.getAgenteById);
router.post('/', authMiddleware, agentesController.createAgente);
router.patch('/:id', authMiddleware, agentesController.updateAgente);
router.delete('/:id', authMiddleware, agentesController.deleteAgente);

module.exports = router;
