const db = require('../db/db');

async function findAll() {
    try {
        const agentes = await db('agentes').select('*');
        console.log('Repository findAll - agentes encontrados:', agentes?.length || 0);
        return agentes;
    } catch (error) {
        console.error('Erro no repository findAll:', error);
        throw error;
    }
}

async function findById(id) {
    return await db('agentes').where({ id }).first();
}

async function create(dadosAgente) {
    try {
        const [novoAgente] = await db('agentes').insert(dadosAgente).returning('*');
        return novoAgente;
    } catch (error) {
        console.error('Erro ao criar agente:', error);
        throw error;
    }
}

async function update(id, dadosAgente) {
    try {
        // Remover o campo 'id' dos dados a serem atualizados para proteger o ID
        const { id: _, ...dadosLimpos } = dadosAgente;
        
        const [agenteAtualizado] = await db('agentes')
            .where({ id })
            .update(dadosLimpos)
            .returning('*');
        return agenteAtualizado;
    } catch (error) {
        console.error('Erro ao atualizar agente:', error);
        throw error;
    }
}

async function deleteById(id) {
    const agente = await findById(id);
    if (agente) {
        await db('agentes').where({ id }).del();
        return agente;
    }
    return null;
}

async function findByCargo(cargo) {
    return await db('agentes').where({ cargo }).select('*');
}

async function findAllSorted(sortBy) {
    if (sortBy === 'dataDeIncorporacao') {
        return await db('agentes').orderBy('dataDeIncorporacao', 'asc');
    }
    
    if (sortBy === '-dataDeIncorporacao') {
        return await db('agentes').orderBy('dataDeIncorporacao', 'desc');
    }
    
    return await db('agentes').select('*');
}

async function findByCargoSorted(cargo, sortBy) {
    let query = db('agentes').where('cargo', cargo);
    
    if (sortBy === 'dataDeIncorporacao') {
        query = query.orderBy('dataDeIncorporacao', 'asc');
    } else if (sortBy === '-dataDeIncorporacao') {
        query = query.orderBy('dataDeIncorporacao', 'desc');
    }
    
    return await query;
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    deleteById,
    findByCargo,
    findAllSorted,
    findByCargoSorted
};
