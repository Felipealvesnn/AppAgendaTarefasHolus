# 🚀 Node.js + TypeScript API Profissional

API REST moderna e escalável construída com Node.js, TypeScript, Express, TSOA e Prisma ORM.

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![Prisma](https://img.shields.io/badge/Prisma-6.x-blueviolet)
![TSOA](https://img.shields.io/badge/TSOA-6.x-orange)

## ✨ Características

- ✅ Arquitetura bem estruturada e desacoplada (Controller-Service-Repository)
- ✅ TypeScript com tipos completos
- ✅ Documentação OpenAPI/Swagger automática com TSOA
- ✅ Validação de dados com anotações TSOA
- ✅ ORM Prisma para acesso ao banco de dados
- ✅ Injeção de dependências com TSyringe
- ✅ Autenticação JWT com middleware de autorização por roles
- ✅ Tratamento de erros centralizado
- ✅ Paginação, filtragem e ordenação de recursos
- ✅ Soft delete para preservação de dados

## 📂 Estrutura do Projeto

```
├── prisma/             # Modelos e migrações do Prisma
├── src/
│   ├── config/         # Configurações do projeto
│   ├── controllers/    # Controladores das rotas
│   ├── dtos/           # Objetos de transferência de dados
│   ├── generated/      # Código gerado automaticamente
│   ├── interfaces/     # Interfaces e contratos
│   ├── ioc/            # Configuração de injeção de dependências
│   ├── middlewares/    # Middlewares (auth, error handling)
│   ├── models/         # Modelos de domínio
│   ├── routes/         # Definições de rotas
│   ├── services/       # Lógica de negócios
│   ├── shared/         # Recursos compartilhados
│   └── index.ts        # Ponto de entrada da aplicação
├── .env                # Variáveis de ambiente (não versionado)
├── .env.example        # Exemplo de variáveis de ambiente
├── tsoa.json           # Configuração do TSOA
└── package.json        # Dependências e scripts
```

## 🚦 Scripts disponíveis

| Script              | Função                                                          |
|---------------------|-----------------------------------------------------------------|
| `npm run dev`       | Inicia o servidor em modo de desenvolvimento com hot-reload     |
| `npm run build`     | Compila o projeto TypeScript para JavaScript                    |
| `npm start`         | Executa a versão compilada da aplicação                         |
| `npm run swagger`   | Gera a documentação Swagger/OpenAPI                             |
| `npm run tsoa:gen`  | Gera rotas e especificações TSOA                                |
| `npm run generate-client` | Gera cliente TypeScript para consumir a API               |
| `npm test`          | Executa os testes unitários e de integração                     |
| `npm run migrate`   | Executa as migrações do banco de dados                          |
| `npm run seed`      | Popula o banco de dados com dados iniciais                      |

## 🛠️ Configuração inicial

### Pré-requisitos

- Node.js 18+ 
- PostgreSQL 
- NPM ou Yarn

### Passos para configuração

1. Clone o repositório
   ```bash
   git clone https://github.com/seu-usuario/minha-api.git
   cd minha-api
   ```

2. Instale as dependências
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

4. Execute as migrações do banco de dados
   ```bash
   npx prisma migrate dev
   ```

5. Inicie o servidor de desenvolvimento
   ```bash
   npm run dev
   ```

## 📖 Documentação da API

A documentação Swagger/OpenAPI está disponível em:

```
http://localhost:3000/docs
```

Para regenerar a documentação após alterações na API:

```bash
npm run tsoa:gen
```

## 🔐 Autenticação e Autorização

A API utiliza autenticação JWT para proteger os endpoints. Para acessar endpoints protegidos:

1. Obtenha um token através do endpoint `/auth/login`
2. Inclua o token no header de autorização:
   ```
   Authorization: Bearer seu_token_jwt
   ```

Os endpoints podem ter diferentes níveis de autorização baseados em roles:
- **admin**: Acesso completo
- **manager**: Acesso a relatórios e gerenciamento limitado
- **user**: Acesso básico a recursos próprios

## 🧪 Testes

Execute os testes com:

```bash
npm test
```

## 🚀 Implantação

### Produção

1. Compile o projeto
   ```bash
   npm run build
   ```

2. Configure as variáveis de ambiente para produção

3. Execute
   ```bash
   npm start
   ```

### Docker

```bash
docker-compose up -d
```

## 📝 Licença

MIT © Seu Nome