const express = require('express');
const router = express.Router();
const agentesController = require('../controllers/agentesController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rota para listar todos os agentes (com suporte a query parameters) - protegida
router.get('/', authMiddleware, agentesController.getAllAgentes);

// Rota para obter um agente específico - protegida
router.get('/:id', authMiddleware, agentesController.getAgenteById);

// Rota para criar um novo agente - protegida
router.post('/', authMiddleware, agentesController.createAgente);

// Rota para atualizar um agente completamente - protegida
router.put('/:id', authMiddleware, agentesController.updateAgentePUT);

// Rota para atualizar um agente parcialmente - protegida
router.patch('/:id', authMiddleware, agentesController.updateAgente);

// Rota para deletar um agente - protegida
router.delete('/:id', authMiddleware, agentesController.deleteAgente);

module.exports = router;
