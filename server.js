require('dotenv').config();
const express = require('express');
const { errorHandler, notFoundHandler } = require('./utils/errorHandler');

// Importar rotas
const agentesRoutes = require('./routes/agentesRoutes');
const casosRoutes = require('./routes/casosRoutes');
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/usuarios', usuariosRoutes);

// Middleware para rotas não encontradas
app.use(notFoundHandler);

// Middleware de tratamento de erros
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em localhost:${PORT}`);
});
