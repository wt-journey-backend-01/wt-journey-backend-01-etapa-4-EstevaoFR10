/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Limpar a tabela antes de inserir
  await knex('usuarios').del();
  
  // Reset auto-increment sequence
  await knex.raw('ALTER SEQUENCE usuarios_id_seq RESTART WITH 1');
  
  // Inserir dados de exemplo
  await knex('usuarios').insert([
    {
      nome: 'Admin Sistema',
      email: 'admin@policia.gov.br',
      senha: '$2b$10$vnu2AYVK5ijpHbb3i5VEmOcI59dugxporAvOdStjI3WXfKTN3rlO.' // Admin@123
    }
  ]);
};
