# API Login - Projeto NestJS

Este projeto é uma API backend desenvolvida com [NestJS](https://nestjs.com/), que oferece funcionalidades de autenticação e gerenciamento de usuários, utilizando banco de dados MySQL e envio de e-mails via SMTP.

---

## Tecnologias Utilizadas

- Node.js
- NestJS (Framework backend)
- TypeORM (ORM para MySQL)
- MySQL (Banco de dados relacional)
- SMTP (Envio de e-mails)
- Jest (Testes unitários e e2e)
- ValidationPipe, Guards, Interceptors (para validação, autenticação e logging)

---

## Estrutura do Projeto

- `src/main.ts`: Ponto de entrada da aplicação, configura pipes globais, CORS e interceptors.
- `src/app.module.ts`: Módulo principal que importa módulos de usuários, autenticação, configura TypeORM e Mailer.
- `src/modules/auth`: Módulo responsável pela autenticação (login, registro, recuperação de senha).
- `src/modules/users`: Módulo responsável pelo gerenciamento de usuários (CRUD, upload de avatar).
- `src/shared`: Contém decorators, guards, interceptors e middlewares compartilhados.
- `test/`: Testes automatizados da aplicação.

---

## Instalação e Configuração

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd <nome-do-projeto>
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente (crie um arquivo `.env` na raiz do projeto):
   ```env
   PORT=3000
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=root
   MYSQL_PASSWORD=sua_senha
   MYSQL_DATABASE=nome_do_banco
   SMTP=smtp://usuario:senha@smtp.exemplo.com:587
   EMAIL_USER=seu_email@exemplo.com
   ```

4. Execute a aplicação:
   ```bash
   npm run start
   ```

---

## Endpoints Principais

### Autenticação (`/auth`)

- `POST /auth/login`: Login do usuário.
- `POST /auth/register`: Registro de novo usuário.
- `POST /auth/forgot-password`: Solicitar recuperação de senha.
- `PATCH /auth/reset-password`: Resetar senha com token.

### Usuários (`/users`)

- `GET /users`: Listar usuários (com paginação: `offset` e `limit`).
- `GET /users/:id`: Obter usuário por ID.
- `POST /users`: Criar novo usuário.
- `PATCH /users/:id`: Atualizar usuário (requer autenticação e autorização).
- `DELETE /users/:id`: Deletar usuário (requer autenticação e autorização).
- `POST /users/avatar`: Upload de avatar do usuário (requer autenticação).

---

## Arquitetura e Design

- Utiliza arquitetura modular do NestJS para separar responsabilidades.
- Validação global via `ValidationPipe`.
- Autenticação e autorização via Guards personalizados.
- Interceptors para logging e validação de arquivos.
- Integração com banco MySQL via TypeORM.
- Envio de e-mails configurado via módulo Mailer.

---

## Testes

- Testes unitários e e2e configurados com Jest.
- Para rodar os testes:
  ```bash
  npm run test
  npm run test:e2e
  ```

---

## Considerações Finais

Este projeto é uma base sólida para APIs RESTful com autenticação e gerenciamento de usuários, seguindo boas práticas do NestJS e arquitetura limpa.
