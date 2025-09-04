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
      senha: '$2b$10$vnu2AYVK5ijpHbb3i5VEmOcI59dugxporAvOdStjI3WXfKTN3rlO.' // Admin@123
    }
  ]);
};
