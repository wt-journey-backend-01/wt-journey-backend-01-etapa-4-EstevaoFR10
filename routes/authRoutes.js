const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Rota para registro de usuário
router.post('/register', authController.register);

// Rota para login de usuário
router.post('/login', authController.login);

// Rota para logout de usuário (POST conforme README)
router.post('/logout', authController.logout);

// Rota para logout de usuário (DELETE para compatibilidade com testes)
router.delete('/logout', authController.logout);

module.exports = router;
