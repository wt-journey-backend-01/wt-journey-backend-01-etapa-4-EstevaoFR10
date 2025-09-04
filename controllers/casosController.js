const casosRepository = require("../repositories/casosRepository");
const agentesRepository = require("../repositories/agentesRepository");
const { validarPayloadCaso } = require("../utils/validators");

async function getAllCasos(req, res) {
    try {
        const { status, agente_id } = req.query;
        
        let casos;
        if (status || agente_id) {
            // Validar status se fornecido
            if (status && !['aberto', 'solucionado'].includes(status)) {
                return res.status(400).json({
                    message: 'Campo status deve ser "aberto" ou "solucionado"'
                });
            }
            
            // Validar agente_id se fornecido
            if (agente_id) {
                const id = parseInt(agente_id, 10);
                if (isNaN(id) || id <= 0) {
                    return res.status(400).json({
                        message: 'agente_id deve ser um número válido'
                    });
                }
            }
            
            casos = await casosRepository.findWithFilters({ status, agente_id });
        } else {
            casos = await casosRepository.findAll();
        }
        
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
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                message: 'ID inválido'
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
        // Validar payload
        const erroValidacao = validarPayloadCaso(req.body, 'POST');
        if (erroValidacao) {
            return res.status(400).json({
                message: erroValidacao
            });
        }
        
        const { titulo, descricao, agente_id, status = 'aberto' } = req.body;
        
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
            agente_id,
            status
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
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                message: 'ID inválido'
            });
        }
        
        // Validar payload para PATCH
        const erroValidacao = validarPayloadCaso(req.body, 'PATCH');
        if (erroValidacao) {
            return res.status(400).json({
                message: erroValidacao
            });
        }
        
        // Se está tentando atualizar agente_id, validar se existe
        if (req.body.agente_id) {
            const agente = await agentesRepository.findById(req.body.agente_id);
            if (!agente) {
                return res.status(404).json({
                    message: 'Agente não encontrado'
                });
            }
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
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                message: 'ID inválido'
            });
        }
        
        // Validar payload para PUT
        const erroValidacao = validarPayloadCaso(req.body, 'PUT');
        if (erroValidacao) {
            return res.status(400).json({
                message: erroValidacao
            });
        }
        
        const { agente_id } = req.body;
        
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
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                message: 'ID inválido'
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

async function getAgenteDoCaso(req, res) {
    try {
        const casoId = parseInt(req.params.caso_id, 10);
        if (isNaN(casoId) || casoId <= 0) {
            return res.status(400).json({
                message: 'ID de caso inválido'
            });
        }

        const caso = await casosRepository.findById(casoId);
        if (!caso) {
            return res.status(404).json({
                message: 'Caso não encontrado'
            });
        }

        const agente = await agentesRepository.findById(caso.agente_id);
        if (!agente) {
            return res.status(404).json({
                message: 'Agente responsável não encontrado'
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

module.exports = {
    getAllCasos,
    getCasoById,
    createCaso,
    updateCaso,
    updateCasoPUT,
    deleteCaso,
    getAgenteDoCaso
};
