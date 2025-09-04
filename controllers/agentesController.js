const agentesRepository = require("../repositories/agentesRepository");

// Função para validar payload de agente
function validarPayloadAgente(body, metodo = 'POST') {
    const camposValidos = ['nome', 'dataDeIncorporacao', 'cargo'];
    const camposRecebidos = Object.keys(body);
    
    // Verificar se há campos extras
    const camposExtras = camposRecebidos.filter(campo => !camposValidos.includes(campo));
    if (camposExtras.length > 0) {
        return `Campos inválidos: ${camposExtras.join(', ')}`;
    }
    
    // Para POST e PUT, todos os campos são obrigatórios
    if (metodo === 'POST' || metodo === 'PUT') {
        for (const campo of camposValidos) {
            if (!body[campo]) {
                return `Campo obrigatório faltando: ${campo}`;
            }
        }
    }
    
    // Validar cargo se fornecido
    if (body.cargo && !['delegado', 'inspetor'].includes(body.cargo)) {
        return 'Campo cargo deve ser "delegado" ou "inspetor"';
    }
    
    return null; // tudo ok
}

async function getAllAgentes(req, res) {
    try {
        const agentes = await agentesRepository.findAll();
        res.status(200).json(agentes);
    } catch (error) {
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
}

async function getAgenteById(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                message: 'ID inválido'
            });
        }
        
        const agente = await agentesRepository.findById(id);
        if (!agente) {
            return res.status(404).json({
                message: 'Agente não encontrado'
            });
        }
        
        res.status(200).json(agente);
    } catch (error) {
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
}

async function createAgente(req, res) {
    try {
        // Validar payload
        const erroValidacao = validarPayloadAgente(req.body, 'POST');
        if (erroValidacao) {
            return res.status(400).json({
                message: erroValidacao
            });
        }
        
        const { nome, dataDeIncorporacao, cargo } = req.body;
        
        const novoAgente = await agentesRepository.create({
            nome,
            dataDeIncorporacao,
            cargo
        });
        
        res.status(201).json(novoAgente);
    } catch (error) {
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
}

async function updateAgente(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                message: 'ID inválido'
            });
        }
        
        // Validar payload para PATCH (campos opcionais)
        const erroValidacao = validarPayloadAgente(req.body, 'PATCH');
        if (erroValidacao) {
            return res.status(400).json({
                message: erroValidacao
            });
        }
        
        const agenteAtualizado = await agentesRepository.update(id, req.body);
        if (!agenteAtualizado) {
            return res.status(404).json({
                message: 'Agente não encontrado'
            });
        }
        
        res.status(200).json(agenteAtualizado);
    } catch (error) {
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
}

async function updateAgentePUT(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                message: 'ID inválido'
            });
        }
        
        // Validar payload para PUT (todos os campos obrigatórios)
        const erroValidacao = validarPayloadAgente(req.body, 'PUT');
        if (erroValidacao) {
            return res.status(400).json({
                message: erroValidacao
            });
        }
        
        const agenteAtualizado = await agentesRepository.update(id, req.body);
        if (!agenteAtualizado) {
            return res.status(404).json({
                message: 'Agente não encontrado'
            });
        }
        
        res.status(200).json(agenteAtualizado);
    } catch (error) {
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
}

async function deleteAgente(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                message: 'ID inválido'
            });
        }
        
        const deletado = await agentesRepository.deleteById(id);
        if (!deletado) {
            return res.status(404).json({
                message: 'Agente não encontrado'
            });
        }
        
        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
}

module.exports = {
    getAllAgentes,
    getAgenteById,
    createAgente,
    updateAgente,
    updateAgentePUT,
    deleteAgente
};
