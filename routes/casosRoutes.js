const express = require('express');
const router = express.Router();
const casosController = require('../controllers/casosController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rota para listar todos os casos (com suporte a query parameters) - protegida
router.get('/', authMiddleware, casosController.getAllCasos);

// Rota para obter um caso específico - protegida
router.get('/:id', authMiddleware, casosController.getCasoById);

// Rota para obter o agente responsável por um caso - protegida
router.get('/:caso_id/agente', authMiddleware, casosController.getAgenteByCasoId);

// Rota para criar um novo caso - protegida
router.post('/', authMiddleware, casosController.createCaso);

// Rota para atualizar um caso completamente - protegida
router.put('/:id', authMiddleware, casosController.updateCasoPUT);

// Rota para atualizar um caso parcialmente - protegida
router.patch('/:id', authMiddleware, casosController.updateCaso);

// Rota para deletar um caso - protegida
router.delete('/:id', authMiddleware, casosController.deleteCaso);

module.exports = router;
