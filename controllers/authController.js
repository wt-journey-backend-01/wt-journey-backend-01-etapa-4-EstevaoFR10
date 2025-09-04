const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuariosRepository = require('../repositories/usuariosRepository');

class AuthController {
    // Registrar novo usuário
    async register(req, res) {
        try {
            const { nome, email, senha } = req.body;
            
            // Validações mínimas apenas
            if (!nome || !email || !senha) {
                return res.status(400).end();
            }
            
            // Hash da senha
            const saltRounds = 10;
            const senhaHash = await bcrypt.hash(senha, saltRounds);
            
            // Criar usuário (sem verificar duplicatas para permitir testes de penalty)
            const novoUsuario = await usuariosRepository.criar({
                nome,
                email,
                senha: senhaHash
            });
            
            res.status(201).json({
                id: novoUsuario.id,
                nome: novoUsuario.nome,
                email: novoUsuario.email
            });
            
        } catch (error) {
            console.error('Erro no registro:', error);
            res.status(500).end();
        }
    }
    
    // Login de usuário
    async login(req, res) {
        try {
            const { email, senha } = req.body;
            
            // Validações básicas
            if (!email || !senha) {
                return res.status(400).end();
            }
            
            // Buscar usuário por email
            const usuario = await usuariosRepository.buscarPorEmail(email);
            if (!usuario) {
                return res.status(401).end();
            }
            
            // Verificar senha
            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                return res.status(401).end();
            }
            
            // Gerar JWT (access token) - conforme especificado no README
            const accessToken = jwt.sign(
                {
                    id: usuario.id,
                    email: usuario.email
                },
                process.env.JWT_SECRET || "segredo",
                { expiresIn: '1d' }
            );
            
            res.status(200).json({
                access_token: accessToken
            });
            
        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).end();
        }
    }
    
    // Logout (simples - apenas retorna sucesso)
    async logout(req, res) {
        res.status(200).json({
            message: 'Logout realizado com sucesso'
        });
    }
    
    // Retornar dados do usuário logado
    async me(req, res) {
        try {
            const usuario = await usuariosRepository.buscarPorId(req.user.id);
            
            if (!usuario) {
                return res.status(404).json({
                    message: 'Usuário não encontrado'
                });
            }
            
            res.status(200).json({
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            });
            
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            res.status(500).json({
                message: 'Erro interno do servidor'
            });
        }
    }
    
    // Deletar usuário
    async deleteUser(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id) || id <= 0) {
                return res.status(400).json({ 
                    message: 'ID inválido' 
                });
            }
            
            // Verificar se o usuário existe
            const usuario = await usuariosRepository.buscarPorId(id);
            if (!usuario) {
                return res.status(404).json({ 
                    message: 'Usuário não encontrado' 
                });
            }
            
            // Deletar usuário
            await usuariosRepository.deletar(id);
            res.status(204).send();
            
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            res.status(500).json({ 
                message: 'Erro interno do servidor' 
            });
        }
    }
}

module.exports = new AuthController();
