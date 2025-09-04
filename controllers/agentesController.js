const agentesRepository = require('../repositories/agentesRepository');

async function getAllAgentes(req, res) {
    try {
        const agentes = await agentesRepository.findAll();
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
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).end();
        }
        
        const { nome, cargo, dataDeIncorporacao } = req.body;
        
        if (!nome || !cargo || !dataDeIncorporacao) {
            return res.status(400).end();
        }
        
        if (typeof nome !== 'string' || typeof cargo !== 'string' || typeof dataDeIncorporacao !== 'string') {
            return res.status(400).end();
        }
        
        // Validar se a string está vazia
        if (nome.trim() === '' || cargo.trim() === '' || dataDeIncorporacao.trim() === '') {
            return res.status(400).end();
        }
        
        // Validar formato da data (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dataDeIncorporacao)) {
            return res.status(400).end();
        }
        
        // Validar se a data não está no futuro
        const dataIncorporacao = new Date(dataDeIncorporacao);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); // Zerar horário para comparar apenas a data
        if (dataIncorporacao > hoje) {
            return res.status(400).end();
        }
        
        const camposPermitidos = ['nome', 'cargo', 'dataDeIncorporacao'];
        const camposRecebidos = Object.keys(req.body);
        const camposExtras = camposRecebidos.filter(campo => !camposPermitidos.includes(campo));
        if (camposExtras.length > 0) {
            return res.status(400).end();
        }
        
        const novoAgente = await agentesRepository.create({
            nome,
            cargo,
            dataDeIncorporacao
        });
        
        res.status(201).json(novoAgente);
    } catch (error) {
        res.status(500).end();
    }
}

async function updateAgentePUT(req, res) {
    try {
        const { nome, cargo, dataDeIncorporacao } = req.body;
        
        // Validações básicas obrigatórias
        if (!nome || !cargo || !dataDeIncorporacao) {
            return res.status(400).end();
        }
        
        // Validar tipos
        if (typeof nome !== 'string' || typeof cargo !== 'string' || typeof dataDeIncorporacao !== 'string') {
            return res.status(400).end();
        }
        
        // Validar se strings não estão vazias
        if (nome.trim() === '' || cargo.trim() === '' || dataDeIncorporacao.trim() === '') {
            return res.status(400).end();
        }
        
        // Validar formato da data (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dataDeIncorporacao)) {
            return res.status(400).end();
        }
        
        // Validar se a data não está no futuro
        const dataIncorporacao = new Date(dataDeIncorporacao);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        if (dataIncorporacao > hoje) {
            return res.status(400).end();
        }
        
        // Impedir alteração do ID
        if (req.body.id) {
            return res.status(400).end();
        }
        
        // Validação de campos extras
        const camposPermitidos = ['nome', 'cargo', 'dataDeIncorporacao'];
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
            cargo,
            dataDeIncorporacao
        });
        
        res.status(200).json(agenteAtualizado);
    } catch (error) {
        res.status(500).end();
    }
}

async function updateAgente(req, res) {
    try {
        // Impedir alteração do ID
        if (req.body.id) {
            return res.status(400).end();
        }
        
        const agente = await agentesRepository.findById(req.params.id);
        if (!agente) {
            return res.status(404).end();
        }
        
        // Validar campos extras
        const camposPermitidos = ['nome', 'cargo', 'dataDeIncorporacao'];
        const camposRecebidos = Object.keys(req.body);
        const camposExtras = camposRecebidos.filter(campo => !camposPermitidos.includes(campo));
        if (camposExtras.length > 0) {
            return res.status(400).end();
        }
        
        // Validações opcionais (só se o campo estiver presente)
        if (req.body.nome !== undefined) {
            if (typeof req.body.nome !== 'string' || req.body.nome.trim() === '') {
                return res.status(400).end();
            }
        }
        
        if (req.body.cargo !== undefined) {
            if (typeof req.body.cargo !== 'string' || req.body.cargo.trim() === '') {
                return res.status(400).end();
            }
        }
        
        if (req.body.dataDeIncorporacao !== undefined) {
            if (typeof req.body.dataDeIncorporacao !== 'string' || req.body.dataDeIncorporacao.trim() === '') {
                return res.status(400).end();
            }
            
            // Validar formato da data (YYYY-MM-DD)
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(req.body.dataDeIncorporacao)) {
                return res.status(400).end();
            }
            
            // Validar se a data não está no futuro
            const dataIncorporacao = new Date(req.body.dataDeIncorporacao);
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            if (dataIncorporacao > hoje) {
                return res.status(400).end();
            }
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
