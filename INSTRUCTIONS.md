# Instruções para Configuração e Execução

## 1. Configurar o banco de dados PostgreSQL com Docker
- Execute o comando para subir o container:
```bash
docker-compose up -d
```

## 2. Executar migrations
- Para criar as tabelas no banco de dados:
```bash
npx knex migrate:latest
```

## 3. Rodar seeds
- Para popular as tabelas com dados iniciais:
```bash
npx knex seed:run
```

## 4. Iniciar a aplicação
```bash
npm start
```

## Scripts adicionais
- `npm run db:reset` - Derruba, recria, migra e popula o banco automaticamente

---

## 🔐 Autenticação e Autorização

### Registro de Usuário
**Endpoint:** `POST /auth/register`

**Exemplo de requisição:**
```json
{
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "senha": "MinhaSenh@123"
}
```

**Validações da senha:**
- Mínimo 8 caracteres
- Pelo menos 1 letra minúscula
- Pelo menos 1 letra maiúscula  
- Pelo menos 1 número
- Pelo menos 1 caractere especial (@$!%*?&)

**Resposta de sucesso (201):**
```json
{
  "message": "Usuário criado com sucesso",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@exemplo.com"
  }
}
```

### Login de Usuário
**Endpoint:** `POST /auth/login`

**Exemplo de requisição:**
```json
{
  "email": "joao@exemplo.com",
  "senha": "MinhaSenh@123"
}
```

**Resposta de sucesso (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Logout de Usuário
**Endpoint:** `POST /auth/logout`

**Resposta de sucesso (200):**
```json
{
  "message": "Logout realizado com sucesso"
}
```

### Exclusão de Usuário
**Endpoint:** `DELETE /users/:id`
**Requer:** Token JWT válido

**Headers necessários:**
```
Authorization: Bearer SEU_TOKEN_JWT_AQUI
```

---

## 🛡️ Rotas Protegidas

Todas as rotas de `/agentes` e `/casos` são protegidas e requerem autenticação via JWT.

### Como usar o token JWT

1. **Faça login** para obter o token
2. **Inclua o token** no header `Authorization` de todas as requisições:

```
Authorization: Bearer SEU_TOKEN_JWT_AQUI
```

### Exemplo de requisição autenticada:
```bash
# Exemplo com curl
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
     http://localhost:3000/agentes
```

### Fluxo de Autenticação Esperado

1. **Registrar usuário:** `POST /auth/register`
2. **Fazer login:** `POST /auth/login` → recebe `access_token`
3. **Usar token:** Incluir em todas as requisições protegidas
4. **Acessar recursos:** `/agentes`, `/casos` com token válido
5. **Fazer logout:** `POST /auth/logout` (opcional)

---

## 📊 Códigos de Status

### Autenticação
- `200 OK` - Login bem-sucedido
- `201 Created` - Usuário criado com sucesso
- `400 Bad Request` - Email já em uso ou dados inválidos
- `401 Unauthorized` - Token inválido ou credenciais incorretas
- `404 Not Found` - Usuário não encontrado
- `500 Internal Server Error` - Erro do servidor

### Validações de Erro Comuns
- **Email já em uso:** Status 400
- **Token inválido/expirado:** Status 401
- **Senha fraca:** Status 400
- **Campos obrigatórios ausentes:** Status 400

---

## 🚀 Endpoints da API

### Autenticação (públicos)
- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Login de usuário
- `POST /auth/logout` - Logout de usuário

### Usuários (protegidos)
- `DELETE /users/:id` - Deletar usuário
- `GET /usuarios/me` - Dados do usuário autenticado (bônus)

### Agentes (protegidos)
- `GET /agentes` - Listar agentes
- `GET /agentes/:id` - Obter agente específico
- `POST /agentes` - Criar agente
- `PUT /agentes/:id` - Atualizar agente (completo)
- `PATCH /agentes/:id` - Atualizar agente (parcial)
- `DELETE /agentes/:id` - Deletar agente

### Casos (protegidos)
- `GET /casos` - Listar casos
- `GET /casos/:id` - Obter caso específico
- `GET /casos/:caso_id/agente` - Obter agente do caso
- `POST /casos` - Criar caso
- `PUT /casos/:id` - Atualizar caso (completo)
- `PATCH /casos/:id` - Atualizar caso (parcial)
- `DELETE /casos/:id` - Deletar caso
