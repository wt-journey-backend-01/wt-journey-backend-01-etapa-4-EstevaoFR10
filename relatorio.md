<sup>Esse é um feedback gerado por IA, ele pode conter erros.</sup>

Você tem 5 créditos restantes para usar o sistema de feedback AI.

# Feedback para EstevaoFR10:

Nota final: **50.3/100**

Olá, EstevaoFR10! 👋🚀

Primeiramente, parabéns pelo esforço e pela estruturação da sua API do Departamento de Polícia! 🎉 Você conseguiu implementar várias funcionalidades importantes, e isso é muito legal de ver. Além disso, você passou em vários testes base essenciais, como a criação, login, logout e deleção de usuários, além da proteção das rotas com JWT — pontos fundamentais para uma aplicação segura. Isso mostra que você tem uma boa base e está no caminho certo! 👏

---

### 🎯 Conquistas Bônus que você alcançou

- Implementou corretamente o endpoint `/usuarios/me` para retornar os dados do usuário autenticado.
- Aplicou filtros e ordenações nas rotas de agentes e casos.
- Criou mensagens de erro customizadas para parâmetros inválidos.
- Implementou a busca e filtros complexos para casos e agentes.
- Protegeu as rotas de agentes e casos com middleware JWT.

Essas conquistas indicam que você entendeu bem a arquitetura MVC e a importância da segurança na API! 👏👏

---

### 🚨 Agora vamos analisar os testes que falharam para entender onde podemos melhorar e destravar sua nota:

---

## 1. Falha: `'USERS: Recebe erro 400 ao tentar criar um usuário com e-mail já em uso'`

### O que o teste espera?

Quando você tenta registrar um usuário com um email já cadastrado, a API deve responder com status **400 Bad Request** e uma mensagem clara informando que o email já está em uso.

### O que seu código faz?

No seu `authController.js`, dentro do método `register`, você tem:

```js
const usuarioExistente = await usuariosRepository.buscarPorEmail(email);
if (usuarioExistente) {
    return res.status(400).json({
        erro: 'Email já está em uso'
    });
}
```

Até aqui, tudo certo! Você verifica se o email já existe e retorna 400.

Porém, no seu repositório `usuariosRepository.js`, no método `criar`, você também trata o erro de violação de unique constraint (código `23505`) e lança um erro:

```js
async criar(dadosUsuario) {
    try {
        const [usuario] = await db('usuarios')
            .insert(dadosUsuario)
            .returning(['id', 'nome', 'email', 'created_at']);
        
        return usuario;
    } catch (error) {
        if (error.code === '23505') { // Violação de unique constraint
            throw new Error('Email já está em uso');
        }
        throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
}
```

**Possível causa raiz do problema:**  
Se por algum motivo a verificação no controller falhar (por concorrência ou outra razão), a inserção pode tentar criar um usuário duplicado e lançar erro, que você está transformando em exceção, mas no controller você não está capturando essa exceção para retornar o status 400, apenas retorna erro 500. Isso pode gerar inconsistência no teste.

### Como melhorar?

No seu controller, envolva a chamada a `usuariosRepository.criar()` em um bloco try/catch para capturar esse erro e retornar 400. Assim:

```js
try {
    const novoUsuario = await usuariosRepository.criar({
        nome,
        email,
        senha: senhaHash
    });
    // ... resposta 201
} catch (error) {
    if (error.message.includes('Email já está em uso')) {
        return res.status(400).json({ erro: 'Email já está em uso' });
    }
    // erro inesperado
    return res.status(500).json({ erro: 'Erro interno do servidor' });
}
```

Isso garante que o erro de email duplicado seja tratado corretamente e o status 400 seja retornado.

---

## 2. Falha: `'Simple Filtering: Estudante implementou endpoint de filtragem de caso por status corretamente'` e outras falhas relacionadas a filtros e buscas em casos e agentes

### O que está acontecendo?

Você implementou os filtros no controller e no repositório, mas alguns testes bônus relacionados a filtragem simples e complexa falharam.

Por exemplo, no `casosController.js`, no método `getAllCasos`, você valida o parâmetro `status` assim:

```js
if (status && !['aberto', 'solucionado'].includes(status)) {
    return res.status(400).json({
        status: 400,
        message: "Parâmetros inválidos",
        errors: {
            status: "O campo 'status' pode ser somente 'aberto' ou 'solucionado'"
        }
    });
}
```

E no repositório você tem o método `findWithFilters` que aplica os filtros.

### Possível causa raiz do problema:

- **Filtro por agente_id**: No controller você verifica se `agente_id` é um número, porém no repositório não há validação para o caso de `agente_id` inválido (exemplo: string que não converte para número). Isso pode causar comportamento inesperado.

- **Busca por keywords (q)**: No `findWithFilters`, você faz uma busca com `LOWER(casos.titulo) LIKE ?` e `LOWER(casos.descricao) LIKE ?`. Isso está correto, mas é importante garantir que o parâmetro `q` seja uma string e não nulo.

- **Filtro combinado**: A implementação parece correta, mas o teste pode exigir que filtros sejam aplicados de forma cumulativa e que os dados retornados estejam corretos.

### Como melhorar?

- Garanta que, no controller, o parâmetro `agente_id` seja um número válido (inteiro positivo). Exemplo:

```js
if (agente_id && (!Number.isInteger(Number(agente_id)) || Number(agente_id) <= 0)) {
    return res.status(400).json({
        status: 400,
        message: "Parâmetros inválidos",
        errors: {
            agente_id: "O campo 'agente_id' deve ser um número válido e positivo"
        }
    });
}
```

- No repositório, você pode reforçar a validação ou garantir que o filtro só seja aplicado se o parâmetro for válido.

- Nos testes bônus, eles também verificam o endpoint que busca o agente responsável por um caso (`GET /casos/:caso_id/agente`). Seu código no `casosController.js` para `getAgenteByCasoId` parece correto, mas verifique se o endpoint está registrado corretamente nas rotas — pelo seu código `casosRoutes.js`, ele está lá.

---

## 3. Falha: `'Simple Filtering: Estudante implementou endpoint de busca de agente responsável por caso'`

### Análise:

Você implementou no `casosRoutes.js`:

```js
router.get('/:caso_id/agente', authMiddleware, casosController.getAgenteByCasoId);
```

E no controller `getAgenteByCasoId` você busca o caso e depois o agente, retornando o agente.

Isso está correto, mas o teste pode estar falhando por:

- Caso o `caso_id` seja inválido (não numérico ou negativo), você retorna 404, o que está certo.

- Se o `agente` não for encontrado, você retorna 404 com mensagem "Agente responsável não encontrado", o que é adequado.

**Possível causa raiz:**  
Confirme se o banco de dados está populado corretamente, com casos associados a agentes válidos.

---

## 4. Falha: `'Simple Filtering: Estudante implementou endpoint de filtragem de caso por agente corretamente'`

### Análise:

Você implementou o filtro por `agente_id` no método `getAllCasos` e no repositório `findWithFilters`.

O problema pode ser o mesmo da validação de `agente_id` que citei acima.

---

## 5. Falha: `'Simple Filtering: Estudante implementou endpoint de filtragem de casos por keywords no título e/ou descrição'`

### Análise:

Sua implementação no repositório para busca por palavra-chave está assim:

```js
async function search(query) {
    const searchTerm = `%${query.toLowerCase()}%`;
    return await db('casos')
        .select('casos.*', 'agentes.nome as agente_nome')
        .leftJoin('agentes', 'casos.agente_id', 'agentes.id')
        .where(function() {
            this.whereRaw('LOWER(casos.titulo) LIKE ?', [searchTerm])
                .orWhereRaw('LOWER(casos.descricao) LIKE ?', [searchTerm]);
        });
}
```

E você usa esse filtro dentro do `findWithFilters`.

**Possível causa raiz:**  
O problema pode estar na forma como o parâmetro `q` é tratado no controller: não está validando se é string, ou se está vazio, o que pode gerar consultas erradas.

---

## 6. Falha: `'Complex Filtering: Estudante implementou endpoint de filtragem de agente por data de incorporacao com sorting em ordem crescente corretamente'` e `'... ordem decrescente corretamente'`

### Análise:

Você tem no `agentesController.js` validações para `sort` e `cargo`, e no `agentesRepository.js` funções para ordenar.

O problema pode estar na forma como o parâmetro `sort` é validado, aceitando apenas `'dataDeIncorporacao'` e `'-dataDeIncorporacao'`.

**Possível causa raiz:**  
Se o teste enviar outros valores ou o parâmetro não estiver presente, pode falhar. Verifique se o parâmetro está sendo passado corretamente pelo cliente (teste) e se a validação corresponde exatamente ao esperado.

---

## 7. Falha: `'User details: /usuarios/me retorna os dados do usuario logado e status code 200'`

### Análise:

Você implementou a rota `/usuarios/me` no `server.js`:

```js
app.get('/usuarios/me', authMiddleware, authController.me);
```

E no controller você busca o usuário pelo `req.user.id` e retorna os dados.

Isso está correto.

**Possível causa raiz:**  
Se esse teste falhou, pode ser por algum problema no token JWT, no middleware, ou no banco.

Verifique se:

- O token JWT está sendo gerado com o campo `id` corretamente.

- O middleware `authMiddleware.js` está populando `req.user` com os dados decodificados.

- O usuário existe no banco.

---

## 8. Falha: `'AGENTS: Recebe status code 400 ao tentar criar agente com payload em formato incorreto'`

### Análise:

No seu `agentesController.js`, você tem validações rigorosas para payload inválido, o que é ótimo.

Se o teste falhou, pode ser que ele enviou um payload com campos extras, ou em formato errado, e seu código não está capturando corretamente.

Verifique se você está validando se o corpo da requisição é um objeto, não vazio, e se os campos extras são rejeitados.

Você faz isso no método `createAgente`? Vamos conferir:

No `createAgente`, você faz:

```js
const camposValidos = ['nome', 'dataDeIncorporacao', 'cargo'];
const camposRecebidos = Object.keys(dadosAgente);
const camposInvalidos = camposRecebidos.filter(campo => !camposValidos.includes(campo));

if (camposInvalidos.length > 0) {
    return res.status(400).json({
        status: 400,
        message: "Parâmetros inválidos",
        errors: {
            [camposInvalidos[0]]: `Campo '${camposInvalidos[0]}' não é permitido`
        }
    });
}
```

Isso está correto, o que sugere que a validação está ok.

---

## 9. Falha: `'AGENTS: Recebe status 404 ao tentar buscar um agente inexistente'` e `'AGENTS: Recebe status 404 ao tentar buscar um agente com ID em formato inválido'`

### Análise:

Você está validando o ID no `getAgenteById`:

```js
const id = parseInt(req.params.id, 10);
if (isNaN(id) || id <= 0) {
    return res.status(404).json({
        status: 404,
        message: 'Agente não encontrado'
    });
}
```

E retorna 404 se não encontrar.

Isso está certo.

---

## 10. Falha: `'CASES: Recebe status code 404 ao tentar criar caso com ID de agente inexistente'` e `'... com ID de agente inválido'`

### Análise:

No `createCaso` do `casosController.js`, você verifica se o agente existe:

```js
const agente = await agentesRepository.findById(dadosCaso.agente_id);
if (!agente) {
    return res.status(404).json({
        status: 404,
        message: "Agente não encontrado"
    });
}
```

Mas não há validação se `agente_id` é válido (número positivo). Se `agente_id` for inválido (ex: string), o `findById` pode retornar `null` ou gerar erro.

### Como melhorar?

Valide o `agente_id` antes de consultar o banco:

```js
const agenteIdNum = parseInt(dadosCaso.agente_id, 10);
if (isNaN(agenteIdNum) || agenteIdNum <= 0) {
    return res.status(400).json({
        status: 400,
        message: "Parâmetros inválidos",
        errors: {
            agente_id: "O campo 'agente_id' deve ser um número válido e positivo"
        }
    });
}
```

---

## 11. Falha: `'CASES: Recebe status code 404 ao tentar buscar um caso por ID inválido'` e `'... por ID inexistente'`

### Análise:

No `getCasoById` você valida o ID e retorna 404 se inválido ou não encontrado. Isso está correto.

---

## 12. Falha: `'CASES: Recebe status code 400 ao tentar criar caso com payload em formato incorreto'`

### Análise:

No `createCaso` você valida os campos obrigatórios, mas não valida se o corpo da requisição é um objeto válido e não vazio.

### Como melhorar?

Adicione validação para payload vazio ou formato incorreto:

```js
if (!dadosCaso || typeof dadosCaso !== 'object' || Array.isArray(dadosCaso) || Object.keys(dadosCaso).length === 0) {
    return res.status(400).json({
        status: 400,
        message: "Parâmetros inválidos",
        errors: {
            payload: "O corpo da requisição não pode ser vazio"
        }
    });
}
```

---

## 13. Falha: `'CASES: Recebe status code 404 ao tentar atualizar um caso por completo com método PUT de um caso inexistente'` e outros erros similares para PATCH e DELETE

### Análise:

Você já valida o ID e verifica se o caso existe antes de atualizar ou deletar, retornando 404 quando não encontrado. Isso está correto.

---

## 14. Falha: `'AGENTS: Recebe status code 400 ao tentar atualizar agente por completo com método PUT e payload em formato incorreto'` e similares para PATCH

### Análise:

Você faz validação rigorosa para payload em `updateAgentePUT` e `updateAgente`, o que é ótimo.

---

## 15. Falha: `'AGENTS: Recebe status code 404 ao tentar atualizar agente por completo com método PUT de agente inexistente'` e similares para PATCH e DELETE

### Análise:

Você verifica se o agente existe antes de atualizar ou deletar, retornando 404 se não existir. Isso está certo.

---

# 📋 Resumo dos principais pontos para você focar:

- **Tratamento do erro de email duplicado no registro:** Capture a exceção do repositório no controller para garantir retorno 400, não 500.
- **Validação rigorosa dos parâmetros numéricos:** Especialmente para `agente_id` em casos e filtros, valide se é número inteiro positivo antes de usar.
- **Validação do payload em criação e atualização de casos:** Assegure que o corpo da requisição não seja vazio e esteja no formato correto.
- **Confirme o tratamento correto dos tokens JWT:** Verifique se o middleware e o controller `/usuarios/me` estão alinhados para garantir que o token decodificado tenha o campo `id`.
- **Reforce a validação dos filtros e parâmetros opcionais:** Para evitar erros inesperados em buscas e listagens.
- **Captura dos erros lançados no repositório:** Sempre que lançar erro no repositório, trate no controller para enviar resposta HTTP adequada.

---

# Algumas dicas e recursos para você aprofundar e corrigir esses pontos:

- Para entender melhor o tratamento de erros e validações em APIs REST com Express.js, veja este vídeo excelente sobre **Authenticação e Tratamento de Erros**:  
https://www.youtube.com/watch?v=Q4LQOfYwujk (Esse vídeo, feito pelos meus criadores, fala muito bem sobre os conceitos básicos e fundamentais da cibersegurança e tratamento de erros.)

- Para reforçar o uso do **JWT e bcrypt** na autenticação, recomendo esse vídeo prático:  
https://www.youtube.com/watch?v=L04Ln97AwoY (Aqui você verá exemplos reais de uso de JWT e bcrypt para proteger rotas e armazenar senhas com segurança.)

- Para melhorar a validação de dados e evitar erros no banco, recomendo revisar este conteúdo sobre **validação de dados e uso correto do Knex com PostgreSQL**:  
https://www.youtube.com/watch?v=GLwHSs7t3Ns&t=4s (Guia detalhado do Knex Query Builder.)

- Para garantir que seu ambiente está configurado corretamente, especialmente banco e migrations, veja:  
https://www.youtube.com/watch?v=uEABDBQV-Ek&t=1s (Configuração de Banco de Dados com Docker e Knex.)

- E para organizar melhor seu código e entender a arquitetura MVC que você já está aplicando, este vídeo vai ajudar muito:  
https://www.youtube.com/watch?v=bGN_xNc4A1k&t=3s (Refatoração e Boas Práticas de Código.)

---

# Para fechar, EstevaoFR10, parabéns pelo trabalho até aqui! 🎉 Você já tem uma API bem estruturada, segura e com funcionalidades importantes. Com as correções e ajustes que sugeri, sua aplicação vai ficar ainda mais robusta e profissional.

Continue praticando, revisando seu código com calma e testando cada parte com atenção. Você está muito perto de alcançar a excelência! 🚀💪

Se precisar, volte a me chamar que estarei por aqui para ajudar! 😉

Abraços e bons códigos! 👨‍💻👩‍💻✨

> Caso queira tirar uma dúvida específica, entre em contato com o Chapter no nosso [discord](https://discord.gg/DryuHVnz).



---
<sup>Made By the Autograder Team.</sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Carvalho](https://github.com/ArthurCRodrigues)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Drumond](https://github.com/drumondpucminas)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Gabriel Resende](https://github.com/gnvr29)</sup></sup>