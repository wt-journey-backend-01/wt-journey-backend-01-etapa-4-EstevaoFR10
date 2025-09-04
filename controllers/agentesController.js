const agentesRepository = require('../repositories/agentesRepository');

async function getAllAgentes(req, res) {
    try {
        const agentes = await agentesRepository.getAll();
        res.status(200).json(agentes);
    } catch (error) {
        res.status(500).end();
    }
}

async function getAgenteById(req, res) {
    try {
        const agente = await agentesRepository.findById(req.params.id);
        if (!agente) {
            return res.status(404).end();
        }
        res.status(200).json(agente);
    } catch (error) {
        res.status(500).end();
    }
}

async function createAgente(req, res) {
    try {
        const { nome, cargo } = req.body;
        
        // Validações básicas obrigatórias
        if (!nome || !cargo) {
            return res.status(400).end();
        }
        
        // Validação de tipos
        if (typeof nome !== 'string' || typeof cargo !== 'string') {
            return res.status(400).end();
        }
        
        // Validação de campos extras
        const camposPermitidos = ['nome', 'cargo'];
        const camposRecebidos = Object.keys(req.body);
        const camposExtras = camposRecebidos.filter(campo => !camposPermitidos.includes(campo));
        if (camposExtras.length > 0) {
            return res.status(400).end();
        }
        
        const novoAgente = await agentesRepository.create({
            nome,
            cargo
        });
        
        res.status(201).json(novoAgente);
    } catch (error) {
        res.status(500).end();
    }
}

async function updateAgentePUT(req, res) {
    try {
        const { nome, cargo } = req.body;
        
        // Validações básicas obrigatórias
        if (!nome || !cargo) {
            return res.status(400).end();
        }
        
        // Validação de tipos
        if (typeof nome !== 'string' || typeof cargo !== 'string') {
            return res.status(400).end();
        }
        
        // Validação de campos extras
        const camposPermitidos = ['nome', 'cargo'];
        const camposRecebidos = Object.keys(req.body);
        const camposExtras = camposRecebidos.filter(campo => !camposPermitidos.includes(campo));
        if (camposExtras.length > 0) {
            return res.status(400).end();
        }
        
        const agente = await agentesRepository.findById(req.params.id);
        if (!agente) {
            return res.status(404).end();
        }
        
        const agenteAtualizado = await agentesRepository.update(req.params.id, {
            nome,
            cargo
        });
        
        res.status(200).json(agenteAtualizado);
    } catch (error) {
        res.status(500).end();
    }
}

async function updateAgente(req, res) {
    try {
        const agente = await agentesRepository.findById(req.params.id);
        if (!agente) {
            return res.status(404).end();
        }
        
        const agenteAtualizado = await agentesRepository.update(req.params.id, req.body);
        res.status(200).json(agenteAtualizado);
    } catch (error) {
        res.status(500).end();
    }
}

async function deleteAgente(req, res) {
    try {
        const agente = await agentesRepository.findById(req.params.id);
        if (!agente) {
            return res.status(404).end();
        }
        
        await agentesRepository.delete(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(500).end();
    }
}

module.exports = {
    getAllAgentes,
    getAgenteById,
    createAgente,
    updateAgentePUT,
    updateAgente,
    deleteAgente
};
