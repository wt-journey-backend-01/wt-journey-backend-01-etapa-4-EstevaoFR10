const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');

// Rota para obter dados do usuário logado
router.get('/me', authMiddleware, authController.me);

module.exports = router;
