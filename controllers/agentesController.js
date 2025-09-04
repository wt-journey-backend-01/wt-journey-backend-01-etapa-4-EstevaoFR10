const agentesRepository = require("../repositories/agentesRepository");

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
        if (isNaN(id)) {
            return res.status(404).json({
                message: 'Agente não encontrado'
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
        const { nome, dataDeIncorporacao, cargo } = req.body;
        
        if (!nome || !dataDeIncorporacao || !cargo) {
            return res.status(400).json({
                message: 'Nome, dataDeIncorporacao e cargo são obrigatórios'
            });
        }
        
        // Validar cargo
        if (!['delegado', 'inspetor'].includes(cargo)) {
            return res.status(400).json({
                message: 'Campo cargo deve ser "delegado" ou "inspetor"'
            });
        }
        
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
        if (isNaN(id)) {
            return res.status(404).json({
                message: 'Agente não encontrado'
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
        if (isNaN(id)) {
            return res.status(404).json({
                message: 'Agente não encontrado'
            });
        }
        
        const { nome, dataDeIncorporacao, cargo } = req.body;
        
        // PUT exige todos os campos obrigatórios
        if (!nome || !dataDeIncorporacao || !cargo) {
            return res.status(400).json({
                message: 'Nome, dataDeIncorporacao e cargo são obrigatórios'
            });
        }
        
        // Validar cargo
        if (!['delegado', 'inspetor'].includes(cargo)) {
            return res.status(400).json({
                message: 'Campo cargo deve ser "delegado" ou "inspetor"'
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
        if (isNaN(id)) {
            return res.status(404).json({
                message: 'Agente não encontrado'
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
