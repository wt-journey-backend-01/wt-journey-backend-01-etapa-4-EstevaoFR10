require('dotenv').config();
const express = require('express');
const { errorHandler, notFoundHandler } = require('./utils/errorHandler');

// Importar rotas
const agentesRoutes = require('./routes/agentesRoutes');
const casosRoutes = require('./routes/casosRoutes');
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const authController = require('./controllers/authController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// Rota raiz
app.get('/', (req, res) => {
    res.json({
        message: 'API do Departamento de Polícia',
        version: '1.0.0',
        endpoints: [
            'GET /agentes',
            'GET /casos',
            'POST /auth/register',
            'POST /auth/login',
            'POST /auth/logout',
            'DELETE /users/:id',
            'GET /usuarios/me'
        ]
    });
});

// Rotas da API
app.use('/agentes', agentesRoutes);
app.use('/casos', casosRoutes);
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);

// Rota específica para /usuarios/me
app.get('/usuarios/me', authMiddleware, authController.me);

// Middleware para rotas não encontradas
app.use(notFoundHandler);

// Middleware de tratamento de erros
app.use(errorHandler);

// Verificar conexão com banco antes de iniciar servidor
const db = require('./db/db');

async function startServer() {
    try {
        // Testar conexão com banco
        await db.raw('SELECT 1');
        console.log('✅ Conexão com banco estabelecida');
        
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Servidor do Departamento de Polícia rodando em localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Erro ao conectar com banco:', error.message);
        process.exit(1);
    }
}

startServer();
