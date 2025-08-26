const db = require('../db/db');

class UsuariosRepository {
    // Buscar usuário por email
    async buscarPorEmail(email) {
        try {
            const usuario = await db('usuarios')
                .where('email', email)
                .first();
            
            return usuario;
        } catch (error) {
            throw new Error(`Erro ao buscar usuário por email: ${error.message}`);
        }
    }
    
    // Buscar usuário por ID
    async buscarPorId(id) {
        try {
            const usuario = await db('usuarios')
                .where('id', id)
                .first();
            
            return usuario;
        } catch (error) {
            throw new Error(`Erro ao buscar usuário por ID: ${error.message}`);
        }
    }
    
    // Criar novo usuário
    async criar(dadosUsuario) {
        try {
            const [usuario] = await db('usuarios')
                .insert(dadosUsuario)
                .returning(['id', 'nome', 'email', 'created_at']);
            
            return usuario;
        } catch (error) {
            if (error.code === '23505') { // Violação de unique constraint
                throw new Error('Email já está em uso');
            }
            throw new Error(`Erro ao criar usuário: ${error.message}`);
        }
    }
    
    // Deletar usuário por ID
    async deletar(id) {
        try {
            const deletedRows = await db('usuarios')
                .where('id', id)
                .del();
            
            return deletedRows > 0;
        } catch (error) {
            throw new Error(`Erro ao deletar usuário: ${error.message}`);
        }
    }
    
    // Buscar todos os usuários (sem a senha)
    async buscarTodos() {
        try {
            const usuarios = await db('usuarios')
                .select('id', 'nome', 'email', 'created_at', 'updated_at');
            
            return usuarios;
        } catch (error) {
            throw new Error(`Erro ao buscar usuários: ${error.message}`);
        }
    }
}

module.exports = new UsuariosRepository();
