const agentesRepository = require("../repositories/agentesRepository");
const { validarPayloadAgente } = require("../utils/validators");

async function getAllAgentes(req, res) {
    try {
        const { cargo } = req.query;
        
        let agentes;
        if (cargo) {
            // Validar cargo
            if (!['delegado', 'inspetor'].includes(cargo)) {
                return res.status(400).json({
                    message: 'Campo cargo deve ser "delegado" ou "inspetor"'
                });
            }
            agentes = await agentesRepository.findByCargo(cargo);
        } else {
            agentes = await agentesRepository.findAll();
        }
        
        console.log('Agentes encontrados:', agentes?.length || 0);
        res.status(200).json(agentes);
    } catch (error) {
        console.error('Erro ao buscar agentes:', error);
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
            console.log('Erro de validação:', erroValidacao);
            return res.status(400).json({
                message: erroValidacao
            });
        }
        
        const { nome, dataDeIncorporacao, cargo } = req.body;
        console.log('Criando agente:', { nome, dataDeIncorporacao, cargo });
        
        const novoAgente = await agentesRepository.create({
            nome,
            dataDeIncorporacao,
            cargo
        });
        
        console.log('Agente criado:', novoAgente);
        res.status(201).json(novoAgente);
    } catch (error) {
        console.error('Erro ao criar agente:', error);
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
