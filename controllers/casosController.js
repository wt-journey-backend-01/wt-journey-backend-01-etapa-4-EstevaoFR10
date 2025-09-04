const casosRepository = require("../repositories/casosRepository");
const agentesRepository = require("../repositories/agentesRepository");

async function getAllCasos(req, res) {
    try {
        const { agente_id, status, q } = req.query;
        
        // Validar status se fornecido
        if (status && !['aberto', 'solucionado'].includes(status)) {
            return res.status(400).json({
                status: 400,
                message: "Parâmetros inválidos",
                errors: {
                    status: "O campo 'status' pode ser somente 'aberto' ou 'solucionado'"
                }
            });
        }
        
        // Validar agente_id se fornecido (deve ser número)
        if (agente_id && isNaN(parseInt(agente_id))) {
            return res.status(400).json({
                status: 400,
                message: "Parâmetros inválidos",
                errors: {
                    agente_id: "O campo 'agente_id' deve ser um número válido"
                }
            });
        }

        // Suporte a filtros múltiplos combinados
        const casos = await casosRepository.findWithFilters({ agente_id, status, q });

        res.status(200).json(casos);
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
}

async function getCasoById(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            return res.status(404).json({
                status: 404,
                message: 'Caso não encontrado'
            });
        }
        const caso = await casosRepository.findById(id);
        if (!caso) {
            return res.status(404).json({
                status: 404,
                message: 'Caso não encontrado'
            });
        }
        res.status(200).json(caso);
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
}

async function getAgenteByCasoId(req, res) {
    try {
        const { caso_id } = req.params;
        const caso = await casosRepository.findById(caso_id);

        if (!caso) {
            return res.status(404).json({
                status: 404,
                message: 'Caso não encontrado'
            });
        }

        const agente = await agentesRepository.findById(caso.agente_id);

        if (!agente) {
            return res.status(404).json({
                status: 404,
                message: 'Agente responsável não encontrado'
            });
        }

        res.status(200).json(agente);
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
}

async function createCaso(req, res) {
    try {
        const dadosCaso = req.body;

        // Validações básicas
        if (!dadosCaso.titulo || !dadosCaso.descricao || !dadosCaso.status || !dadosCaso.agente_id) {
            return res.status(400).json({
                status: 400,
                message: "Parâmetros inválidos",
                errors: {
                    titulo: !dadosCaso.titulo ? "Campo 'titulo' é obrigatório" : null,
                    descricao: !dadosCaso.descricao ? "Campo 'descricao' é obrigatório" : null,
                    status: !dadosCaso.status ? "Campo 'status' é obrigatório" : null,
                    agente_id: !dadosCaso.agente_id ? "Campo 'agente_id' é obrigatório" : null
                }
            });
        }

        // Validar status
        if (dadosCaso.status && !['aberto', 'solucionado'].includes(dadosCaso.status)) {
            return res.status(400).json({
                status: 400,
                message: "Parâmetros inválidos",
                errors: {
                    status: "O campo 'status' pode ser somente 'aberto' ou 'solucionado'"
                }
            });
        }

        // Verificar se agente existe - retornar 404 se não existir
        const agente = await agentesRepository.findById(dadosCaso.agente_id);
        if (!agente) {
            return res.status(404).json({
                status: 404,
                message: "Agente não encontrado"
            });
        }
        
        const novoCaso = await casosRepository.create(dadosCaso);
        res.status(201).json(novoCaso);
    } catch (error) {
        res.status(500).json({ 
            status: 500,
            message: 'Erro interno do servidor',
            error: error.message 
        });
    }
}

async function updateCasoPUT(req, res) {
    try {
        const { id } = req.params;
        const dadosCaso = req.body;
        
        // Verificar se está tentando alterar o ID
        if (dadosCaso.id !== undefined) {
            return res.status(400).json({
                status: 400,
                message: "Parâmetros inválidos",
                errors: {
                    id: "Campo 'id' não pode ser alterado"
                }
            });
        }
        
        // PUT exige todos os campos obrigatórios
        if (!dadosCaso.titulo || !dadosCaso.descricao || !dadosCaso.status || !dadosCaso.agente_id) {
            return res.status(400).json({
                status: 400,
                message: "Parâmetros inválidos",
                errors: {
                    titulo: !dadosCaso.titulo ? "Campo 'titulo' é obrigatório" : null,
                    descricao: !dadosCaso.descricao ? "Campo 'descricao' é obrigatório" : null,
                    status: !dadosCaso.status ? "Campo 'status' é obrigatório" : null,
                    agente_id: !dadosCaso.agente_id ? "Campo 'agente_id' é obrigatório" : null
                }
            });
        }
        
        // Validar status
        if (!['aberto', 'solucionado'].includes(dadosCaso.status)) {
            return res.status(400).json({
                status: 400,
                message: "Parâmetros inválidos",
                errors: {
                    status: "O campo 'status' pode ser somente 'aberto' ou 'solucionado'"
                }
            });
        }
        
        // Verificar se agente existe
        const agente = await agentesRepository.findById(dadosCaso.agente_id);
        if (!agente) {
            return res.status(404).json({
                status: 404,
                message: "Agente não encontrado"
            });
        }
        
        const casoAtualizado = await casosRepository.update(id, dadosCaso);
        
        if (!casoAtualizado) {
            return res.status(404).json({ 
                status: 404,
                message: 'Caso não encontrado'
            });
        }
        
        res.status(200).json(casoAtualizado);
    } catch (error) {
        res.status(500).json({ 
            status: 500,
            message: 'Erro interno do servidor',
            error: error.message 
        });
    }
}async function updateCaso(req, res) {
    try {
        const { id } = req.params;
        const dadosCaso = req.body;

        // Verificar se está tentando alterar o ID
        if (dadosCaso.id !== undefined) {
            return res.status(400).json({
                status: 400,
                message: "Parâmetros inválidos",
                errors: {
                    id: "Campo 'id' não pode ser alterado"
                }
            });
        }

        // Validação extremamente rigorosa para payload inválido
        // Verificar se o body está vazio ou tem formato inválido
        if (!dadosCaso || typeof dadosCaso !== 'object' || Array.isArray(dadosCaso) || Object.keys(dadosCaso).length === 0) {
            return res.status(400).json({
                status: 400,
                message: "Parâmetros inválidos",
                errors: {
                    payload: "O corpo da requisição não pode ser vazio"
                }
            });
        }

        // Verificar cada campo individualmente com validação extrema
        for (const [campo, valor] of Object.entries(dadosCaso)) {
            if (campo === 'id') continue; // ID já validado acima

            // Se não é um campo permitido
            if (!['titulo', 'descricao', 'status', 'agente_id'].includes(campo)) {
                return res.status(400).json({
                    status: 400,
                    message: "Parâmetros inválidos",
                    errors: {
                        [campo]: `Campo '${campo}' não é permitido`
                    }
                });
            }

            // Se o valor não é string, null ou undefined
            if (valor !== null && valor !== undefined && typeof valor !== 'string') {
                return res.status(400).json({
                    status: 400,
                    message: "Parâmetros inválidos",
                    errors: {
                        [campo]: `Campo '${campo}' deve ser uma string`
                    }
                });
            }
        }

        // Validar status se fornecido
        if (dadosCaso.status && !['aberto', 'solucionado'].includes(dadosCaso.status)) {
            return res.status(400).json({
                status: 400,
                message: "Parâmetros inválidos",
                errors: {
                    status: "O campo 'status' pode ser somente 'aberto' ou 'solucionado'"
                }
            });
        }

        // Verificar se agente existe se fornecido
        if (dadosCaso.agente_id) {
            const agente = await agentesRepository.findById(dadosCaso.agente_id);
            if (!agente) {
                return res.status(404).json({
                    status: 404,
                    message: "Agente não encontrado"
                });
            }
        }

        const casoAtualizado = await casosRepository.update(id, dadosCaso);

        if (!casoAtualizado) {
            return res.status(404).json({
                status: 404,
                message: 'Caso não encontrado'
            });
        }

        res.status(200).json(casoAtualizado);
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
}

async function deleteCaso(req, res) {
    try {
        const { id } = req.params;
        const casoDeletado = await casosRepository.deleteById(id);

        if (!casoDeletado) {
            return res.status(404).json({
                status: 404,
                message: 'Caso não encontrado'
            });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
}

module.exports = {
    getAllCasos,
    getCasoById,
    getAgenteByCasoId,
    createCaso,
    updateCaso,
    updateCasoPUT,
    deleteCaso
};
