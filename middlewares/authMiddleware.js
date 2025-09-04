const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Verificar se o header Authorization existe
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).end();
        }
        
        // Verificar se o formato é "Bearer token"
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).end();
        }
        
        // Verificar se o JWT é válido
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Adicionar dados do usuário ao request
        req.user = decoded;
        
        next();
    } catch (error) {
        return res.status(401).end();
    }
};

module.exports = authMiddleware;
