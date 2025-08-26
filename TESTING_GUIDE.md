# 🧪 Guia de Testes da API

## Como testar todas as funcionalidades implementadas

### 1. 📝 Registrar usuário
```bash
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@teste.com",
  "senha": "MinhaSenh@123"
}
```

### 2. 🔑 Fazer login
```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "joao@teste.com",
  "senha": "MinhaSenh@123"
}
```

**Resposta esperada:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "a1b2c3d4e5f6...",
  "expires_in": 900
}
```

### 3. 🛡️ Testar rota protegida (sem token - deve dar erro)
```bash
GET http://localhost:3000/agentes
```

**Resposta esperada:** Status 401

### 4. ✅ Testar rota protegida (com token válido)
```bash
GET http://localhost:3000/agentes
Authorization: Bearer SEU_ACCESS_TOKEN_AQUI
```

### 5. 👤 Obter dados do usuário autenticado (BÔNUS)
```bash
GET http://localhost:3000/usuarios/me
Authorization: Bearer SEU_ACCESS_TOKEN_AQUI
```

### 6. 🔄 Renovar access token (BÔNUS)
```bash
POST http://localhost:3000/auth/refresh
Content-Type: application/json

{
  "refresh_token": "SEU_REFRESH_TOKEN_AQUI"
}
```

### 7. 🚪 Fazer logout
```bash
POST http://localhost:3000/auth/logout
```

### 8. 🗑️ Deletar usuário
```bash
DELETE http://localhost:3000/users/1
Authorization: Bearer SEU_ACCESS_TOKEN_AQUI
```

---

## 🛠️ Testando com curl (linha de comando)

### Registrar usuário:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva","email":"joao@teste.com","senha":"MinhaSenh@123"}'
```

### Fazer login:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@teste.com","senha":"MinhaSenh@123"}'
```

### Acessar rota protegida:
```bash
curl -X GET http://localhost:3000/agentes \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 📊 Status Codes esperados

- ✅ **200 OK** - Login, renovação de token, acesso autorizado
- ✅ **201 Created** - Usuário criado
- ❌ **400 Bad Request** - Dados inválidos, email em uso
- ❌ **401 Unauthorized** - Token inválido, credenciais incorretas
- ❌ **404 Not Found** - Usuário não encontrado
- ❌ **500 Internal Server Error** - Erro do servidor

---

## ⚡ Funcionalidades Implementadas

### ✅ **Funcionalidades Obrigatórias:**
- [x] Registro de usuários com validação de senha
- [x] Login com JWT
- [x] Logout
- [x] Exclusão de usuários
- [x] Proteção de todas as rotas de agentes e casos
- [x] Middleware de autenticação
- [x] Documentação completa

### 🌟 **Funcionalidades Bônus:**
- [x] Endpoint `/usuarios/me` para dados do usuário
- [x] Refresh tokens para sessões prolongadas
- [x] Access tokens de curta duração (15 min)
- [x] Refresh tokens de longa duração (7 dias)
- [x] Sistema robusto de renovação de tokens

---

## 🔐 Segurança Implementada

- **Hash de senhas** com bcrypt (salt rounds: 10)
- **JWT com expiração** configurável
- **Refresh tokens** seguros armazenados no banco
- **Validação robusta** de senhas e emails
- **Middleware de autenticação** em todas as rotas sensíveis
- **Proteção contra** ataques de força bruta
- **Separação de responsabilidades** (Repository pattern)
