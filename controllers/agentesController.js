const agentesRepository = require("../repositories/agentesRepository");

async function getAllAgentes(req, res) {
    try {
        const { cargo } = req.query;
        
        let agentes;
        if (cargo) {
            if (!['delegado', 'inspetor'].includes(cargo)) {
                return res.status(400).end();
            }
            agentes = await agentesRepository.findByCargo(cargo);
        } else {
            agentes = await agentesRepository.findAll();
        }
        
        res.status(200).json(agentes);
    } catch (error) {
        res.status(500).end();
    }
}

async function getAgenteById(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            return res.status(400).end();
        }
        
        const agente = await agentesRepository.findById(id);
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
        const { nome, dataDeIncorporacao, cargo } = req.body;
        
        if (!nome || !dataDeIncorporacao || !cargo) {
            return res.status(400).end();
        }
        
        if (!['delegado', 'inspetor'].includes(cargo)) {
            return res.status(400).end();
        }
        
        const novoAgente = await agentesRepository.create({
            nome,
            dataDeIncorporacao,
            cargo
        });
        
        res.status(201).json(novoAgente);
    } catch (error) {
        res.status(500).end();
    }
}

async function updateAgente(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            return res.status(400).end();
        }
        
        if (req.body.cargo && !['delegado', 'inspetor'].includes(req.body.cargo)) {
            return res.status(400).end();
        }
        
        const agenteAtualizado = await agentesRepository.update(id, req.body);
        if (!agenteAtualizado) {
            return res.status(404).end();
        }
        
        res.status(200).json(agenteAtualizado);
    } catch (error) {
        res.status(500).end();
    }
}

async function updateAgentePUT(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            return res.status(400).end();
        }
        
        const { nome, dataDeIncorporacao, cargo } = req.body;
        
        if (!nome || !dataDeIncorporacao || !cargo) {
            return res.status(400).end();
        }
        
        if (!['delegado', 'inspetor'].includes(cargo)) {
            return res.status(400).end();
        }
        
        const agenteAtualizado = await agentesRepository.update(id, req.body);
        if (!agenteAtualizado) {
            return res.status(404).end();
        }
        
        res.status(200).json(agenteAtualizado);
    } catch (error) {
        res.status(500).end();
    }
}

async function deleteAgente(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            return res.status(400).end();
        }
        
        const deletado = await agentesRepository.deleteById(id);
        if (!deletado) {
            return res.status(404).end();
        }
        
        res.status(204).end();
    } catch (error) {
        res.status(500).end();
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
