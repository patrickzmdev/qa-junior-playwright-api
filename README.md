# Automação API - GoRest (Playwright)

Projeto de automação de testes de API para a GoRest API utilizando Playwright com TypeScript, seguindo boas práticas de modularização e testes independentes.

## Tecnologias Utilizadas

- **Playwright** - Framework de automação
- **TypeScript** - Linguagem tipada
- **Node.js** - Ambiente de execução
- **dotenv** - Gerenciamento de variáveis de ambiente

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js (versão 16 ou superior)
- npm ou yarn
- Git

## Instalação

### Clonar o repositório
```bash
git clone https://github.com/patrickzmdev/qa-junior-playwright-api.git
cd qa-junior-playwright-api
```

### Instalar dependências
```bash
npm install
```

## Configuração

### Configurar variáveis de ambiente

**1. Copie o arquivo `.env.example` para `.env`:**

```powershell
# Windows (PowerShell)
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

**2. Edite o arquivo `.env` com suas credenciais:**

```env
BASE_URL=https://gorest.co.in/public/v2
TOKEN=seu_token_aqui
```

### **IMPORTANTE:**

- O arquivo `.env` está no `.gitignore` e nunca será comitado
- Nunca compartilhe credenciais reais em repositórios públicos
- Para ambientes de CI/CD, use secrets do GitHub/GitLab

> **Como obter o token:** Acesse [gorest.co.in](https://gorest.co.in/), faça login e gere seu token de acesso em "My Account → Access Tokens"

## Execução dos Testes

### Comandos disponíveis

```bash
# Executar todos os testes
npx playwright test

# Executar testes específicos
npx playwright test tests/users.spec.ts
npx playwright test tests/posts.spec.ts
npx playwright test tests/comments.spec.ts

# Executar em modo UI (interface gráfica interativa)
npx playwright test --ui

# Ver relatório HTML dos testes
npx playwright show-report
```




