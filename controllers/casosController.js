const casosRepository = require("../repositories/casosRepository");
const agentesRepository = require("../repositories/agentesRepository");

async function getAllCasos(req, res) {
    try {
        const casos = await casosRepository.findAll();
        res.status(200).json(casos);
    } catch (error) {
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
}

async function getCasoById(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(404).json({
                message: 'Caso não encontrado'
            });
        }
        
        const caso = await casosRepository.findById(id);
        if (!caso) {
            return res.status(404).json({
                message: 'Caso não encontrado'
            });
        }
        
        res.status(200).json(caso);
    } catch (error) {
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
}

async function createCaso(req, res) {
    try {
        const { titulo, descricao, agente_id } = req.body;
        
        if (!titulo || !descricao || !agente_id) {
            return res.status(400).json({
                message: 'Titulo, descricao e agente_id são obrigatórios'
            });
        }
        
        // Validar se o agente existe
        const agente = await agentesRepository.findById(agente_id);
        if (!agente) {
            return res.status(404).json({
                message: 'Agente não encontrado'
            });
        }
        
        const novoCaso = await casosRepository.create({
            titulo,
            descricao,
            agente_id
        });
        
        res.status(201).json(novoCaso);
    } catch (error) {
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
}

async function updateCaso(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(404).json({
                message: 'Caso não encontrado'
            });
        }
        
        const casoAtualizado = await casosRepository.update(id, req.body);
        if (!casoAtualizado) {
            return res.status(404).json({
                message: 'Caso não encontrado'
            });
        }
        
        res.status(200).json(casoAtualizado);
    } catch (error) {
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
}

async function updateCasoPUT(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(404).json({
                message: 'Caso não encontrado'
            });
        }
        
        const { titulo, descricao, agente_id } = req.body;
        
        // PUT exige todos os campos obrigatórios
        if (!titulo || !descricao || !agente_id) {
            return res.status(400).json({
                message: 'Titulo, descricao e agente_id são obrigatórios'
            });
        }
        
        // Validar se o agente existe
        const agente = await agentesRepository.findById(agente_id);
        if (!agente) {
            return res.status(404).json({
                message: 'Agente não encontrado'
            });
        }
        
        const casoAtualizado = await casosRepository.update(id, req.body);
        if (!casoAtualizado) {
            return res.status(404).json({
                message: 'Caso não encontrado'
            });
        }
        
        res.status(200).json(casoAtualizado);
    } catch (error) {
        res.status(500).json({
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
}

async function deleteCaso(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(404).json({
                message: 'Caso não encontrado'
            });
        }
        
        const deletado = await casosRepository.deleteById(id);
        if (!deletado) {
            return res.status(404).json({
                message: 'Caso não encontrado'
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
    getAllCasos,
    getCasoById,
    createCaso,
    updateCaso,
    updateCasoPUT,
    deleteCaso
};
