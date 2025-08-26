const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Verificar se o header Authorization existe
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ 
                erro: 'Token de acesso requerido' 
            });
        }
        
        // Verificar se o formato é "Bearer token"
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                erro: 'Formato de token inválido' 
            });
        }
        
        // Verificar se o JWT é válido
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Adicionar dados do usuário ao request
        req.user = decoded;
        
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                erro: 'Token inválido' 
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                erro: 'Token expirado' 
            });
        }
        
        return res.status(500).json({ 
            erro: 'Erro interno do servidor' 
        });
    }
};

module.exports = authMiddleware;
