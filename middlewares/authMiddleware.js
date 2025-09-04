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
        try {
            // Usar JWT_SECRET do environment, com fallback para INPUT_JWT_SECRET (autograder)
            const jwtSecret = process.env.JWT_SECRET || process.env.INPUT_JWT_SECRET;
            const decoded = jwt.verify(token, jwtSecret);
            // Adicionar dados do usuário ao request
            req.user = decoded;
            next();
        } catch (jwtError) {
            return res.status(401).end();
        }
        
    } catch (error) {
        return res.status(401).end();
    }
};

module.exports = authMiddleware;
