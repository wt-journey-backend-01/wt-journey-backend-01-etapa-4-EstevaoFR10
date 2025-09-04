const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuariosRepository = require('../repositories/usuariosRepository');

class AuthController {
    // Registrar novo usuário
    async register(req, res) {
        try {
            const { nome, email, senha } = req.body;
            
            // Validações básicas
            if (!nome || !email || !senha) {
                return res.status(400).json({
                    erro: 'Nome, email e senha são obrigatórios'
                });
            }
            
            // Validação de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    erro: 'Email deve ter um formato válido'
                });
            }
            
            // Validação de senha (mín. 8 chars, 1 minúscula, 1 maiúscula, 1 número, 1 especial)
            const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!senhaRegex.test(senha)) {
                return res.status(400).json({
                    erro: 'A senha deve ter no mínimo 8 caracteres, incluindo pelo menos uma letra minúscula, uma maiúscula, um número e um caractere especial'
                });
            }
            
            // Verificar se o email já existe
            const usuarioExistente = await usuariosRepository.buscarPorEmail(email);
            if (usuarioExistente) {
                return res.status(400).json({
                    erro: 'Email já está em uso'
                });
            }
            
            // Hash da senha
            const saltRounds = 10;
            const senhaHash = await bcrypt.hash(senha, saltRounds);
            
            // Criar usuário
            const novoUsuario = await usuariosRepository.criar({
                nome,
                email,
                senha: senhaHash
            });
            
            res.status(201).json({
                message: 'Usuário criado com sucesso',
                usuario: {
                    id: novoUsuario.id,
                    nome: novoUsuario.nome,
                    email: novoUsuario.email
                }
            });
            
        } catch (error) {
            console.error('Erro no registro:', error);
            res.status(500).json({
                erro: 'Erro interno do servidor'
            });
        }
    }
    
    // Login de usuário
    async login(req, res) {
        try {
            const { email, senha } = req.body;
            
            // Validações básicas
            if (!email || !senha) {
                return res.status(400).json({
                    erro: 'Email e senha são obrigatórios'
                });
            }
            
            // Buscar usuário por email
            const usuario = await usuariosRepository.buscarPorEmail(email);
            if (!usuario) {
                return res.status(401).json({
                    erro: 'Credenciais inválidas'
                });
            }
            
            // Verificar senha
            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                return res.status(401).json({
                    erro: 'Credenciais inválidas'
                });
            }
            
            // Gerar JWT (access token)
            const accessToken = jwt.sign(
                {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' } // Token de 1 hora
            );
            
            res.status(200).json({
                access_token: accessToken
            });
            
        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({
                erro: 'Erro interno do servidor'
            });
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
            // req.user vem do middleware de autenticação
            const usuario = await usuariosRepository.buscarPorId(req.user.id);
            
            if (!usuario) {
                return res.status(404).json({
                    erro: 'Usuário não encontrado'
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
                erro: 'Erro interno do servidor'
            });
        }
    }
    
    // Deletar usuário
    async deleteUser(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(404).json({ erro: 'Usuário não encontrado' });
            }
            // Verificar se o usuário existe
            const usuario = await usuariosRepository.buscarPorId(id);
            if (!usuario) {
                return res.status(404).json({ erro: 'Usuário não encontrado' });
            }
            // Deletar usuário
            const deletado = await usuariosRepository.deletar(id);
            if (deletado) {
                return res.status(204).send();
            } else {
                res.status(500).json({ erro: 'Erro ao deletar usuário' });
            }
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            res.status(500).json({ erro: 'Erro interno do servidor' });
        }
    }
}

module.exports = new AuthController();
