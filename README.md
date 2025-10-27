# Testes de API com Playwright - GoRest

Projeto de testes automatizados de API REST utilizando Playwright Test e TypeScript para validar os endpoints da [GoRest API](https://gorest.co.in/).

## Sobre o Projeto

Este projeto implementa testes automatizados end-to-end para validar operações CRUD (Create, Read, Update, Delete) nos seguintes recursos:

- **Users** - Gerenciamento de usuários
- **Posts** - Publicações de usuários  
- **Comments** - Comentários em publicações

## Tecnologias Utilizadas

- [Node.js](https://nodejs.org/) v16+
- [Playwright Test](https://playwright.dev/) v1.56+
- [TypeScript](https://www.typescriptlang.org/)
- [dotenv](https://github.com/motdotla/dotenv) - Gerenciamento de variáveis de ambiente

## Pré-requisitos

- Node.js (versão 16 ou superior)
- npm (gerenciador de pacotes)
- Token de acesso da GoRest API

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/patrickzmdev/qa-junior-playwright-api.git
cd qa-junior-playwright-api
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Copie o arquivo de exemplo
copy .env.example .env
```

4. Edite o arquivo `.env` e adicione seu token:
```env
BASE_URL=https://gorest.co.in/public/v2
TOKEN=seu_token_aqui
```

> 💡 **Como obter o token**: Acesse [gorest.co.in](https://gorest.co.in/), faça login e gere seu token de acesso em "My Account → Access Tokens"

## ▶️ Executando os Testes

### Comandos Básicos

```bash
# Rodar todos os testes
npx playwright test

# Rodar testes específicos
npx playwright test tests/users.spec.ts
npx playwright test tests/posts.spec.ts
npx playwright test tests/comments.spec.ts

# Rodar com interface visual
npx playwright test --ui

# Ver relatório HTML
npx playwright show-report
```
## Cobertura de Testes

### Users API (4 testes)
- Criar novo usuário
- Buscar usuário existente
- Atualizar usuário
- Deletar usuário

### Posts API (5 testes)
- Criar novo post
- Listar posts
- Buscar post específico
- Atualizar post
- Deletar post

### Comments API (6 testes)
- Criar novo comentário
- Listar comentários
- Buscar comentário específico
- Atualizar comentário
- Deletar comentário
- Listar comentários de um post

**Total: 15 testes automatizados**

## Boas Práticas Implementadas

### Testes Independentes
Cada teste cria seus próprios dados e faz cleanup automático, permitindo execução em paralelo sem conflitos.

### Dados Únicos
Uso de UUID (`crypto.randomUUID()`) para gerar emails e nomes únicos, evitando colisões mesmo em testes paralelos.

### Estrutura Modular
- Helpers separados por domínio (users, posts, comments)
- Interfaces TypeScript para type-safety
- Configuração centralizada em `config.ts`

### DRY (Don't Repeat Yourself)
- Sem duplicação de código
- Headers e URLs centralizados
- Funções reutilizáveis

### Cleanup Automático
Todos os recursos criados durante os testes são deletados automaticamente ao final, mantendo a API limpa.




