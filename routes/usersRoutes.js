const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Rota para deletar usuário (protegida)
router.delete('/:id', authMiddleware, authController.deleteUser);

// Rota para /usuarios/me (protegida)
router.get('/me', authMiddleware, authController.me);

module.exports = router;
