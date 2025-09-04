function validarPayloadAgente(payload, metodo) {
    const camposObrigatorios = ['nome', 'dataDeIncorporacao', 'cargo'];
    const camposPermitidos = ['nome', 'dataDeIncorporacao', 'cargo'];
    
    // Verificar se tem campos obrigatórios (para POST)
    if (metodo === 'POST') {
        for (const campo of camposObrigatorios) {
            if (!payload[campo]) {
                return `Campo obrigatório ausente: ${campo}`;
            }
        }
    }
    
    // Verificar se tem campos extras
    for (const campo in payload) {
        if (!camposPermitidos.includes(campo)) {
            return `Campo não permitido: ${campo}`;
        }
    }
    
    // Validar cargo
    if (payload.cargo && !['delegado', 'inspetor'].includes(payload.cargo)) {
        return 'Campo cargo deve ser "delegado" ou "inspetor"';
    }
    
    return null;
}

function validarPayloadCaso(payload, metodo) {
    const camposObrigatorios = ['titulo', 'descricao', 'agente_id'];
    const camposPermitidos = ['titulo', 'descricao', 'status', 'agente_id'];
    
    // Verificar se tem campos obrigatórios (para POST)
    if (metodo === 'POST') {
        for (const campo of camposObrigatorios) {
            if (!payload[campo]) {
                return `Campo obrigatório ausente: ${campo}`;
            }
        }
    }
    
    // Verificar se tem campos extras
    for (const campo in payload) {
        if (!camposPermitidos.includes(campo)) {
            return `Campo não permitido: ${campo}`;
        }
    }
    
    // Validar status
    if (payload.status && !['aberto', 'solucionado'].includes(payload.status)) {
        return 'Status deve ser: aberto ou solucionado';
    }
    
    return null;
}

function validarPayloadUsuario(payload) {
    const camposObrigatorios = ['nome', 'email', 'senha'];
    const camposPermitidos = ['nome', 'email', 'senha'];
    
    // Verificar se tem campos obrigatórios
    for (const campo of camposObrigatorios) {
        if (!payload[campo]) {
            return `Campo obrigatório ausente: ${campo}`;
        }
    }
    
    // Verificar se tem campos extras
    for (const campo in payload) {
        if (!camposPermitidos.includes(campo)) {
            return `Campo não permitido: ${campo}`;
        }
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
        return 'Email inválido';
    }
    
    // Validar senha (mínimo 8 caracteres, pelo menos uma letra minúscula, uma maiúscula, um número e um caractere especial)
    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!senhaRegex.test(payload.senha)) {
        return 'Senha deve ter no mínimo 8 caracteres, incluindo pelo menos uma letra minúscula, uma maiúscula, um número e um caractere especial';
    }
    
    return null;
}

module.exports = {
    validarPayloadAgente,
    validarPayloadCaso,
    validarPayloadUsuario
};
