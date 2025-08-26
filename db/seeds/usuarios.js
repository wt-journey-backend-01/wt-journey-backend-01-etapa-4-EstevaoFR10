/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Limpar a tabela antes de inserir
  await knex('usuarios').del();
  
  // Inserir dados de exemplo
  await knex('usuarios').insert([
    {
      id: 1,
      nome: 'Admin Sistema',
      email: 'admin@policia.gov.br',
      senha: '$2b$10$XYZ123abc' // Senha hasheada de exemplo
    },
    {
      id: 2,
      nome: 'João Silva',
      email: 'joao.silva@policia.gov.br',
      senha: '$2b$10$ABC789xyz' // Senha hasheada de exemplo
    },
    {
      id: 3,
      nome: 'Maria Santos',
      email: 'maria.santos@policia.gov.br',
      senha: '$2b$10$DEF456uvw' // Senha hasheada de exemplo
    }
  ]);
};
