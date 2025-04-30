# 🚀 Node.js + TypeScript API Template

Este repositório é um **template base para criação de APIs REST** usando Node.js com TypeScript, Express e Swagger.

Ideal para projetos novos onde você quer começar com uma estrutura modular, com documentação automática e suporte a boas práticas.

---

## 📂 Estrutura do Projeto

```
src/
├── config/          # Configurações do projeto (ex: env)
├── controllers/     # Lógica dos endpoints
├── middlewares/     # Tratamento de erros e outros
├── models/          # Tipos/interfaces dos dados
├── routes/          # Definição e agrupamento das rotas
├── services/        # Regras de negócio
├── swagger.ts       # Script que gera a documentação automaticamente
├── index.ts         # Entrada principal da aplicação
```

---

## 🚦 Scripts disponíveis

| Script              | Função                                                          |
|---------------------|-----------------------------------------------------------------|
| `npm run dev`       | Inicia a API em modo de desenvolvimento com `ts-node-dev`      |
| `npm run build`     | Compila o projeto TypeScript para a pasta `dist`               |
| `npm start`         | Executa a versão compilada (`dist/index.js`)                   |
| `npm run swagger`   | Gera o arquivo `swagger-output.json` automaticamente           |

---

## 📖 Documentação Swagger

Após rodar `npm run swagger`, a documentação estará disponível em:

```
http://localhost:3000/docs
```

### Gerar novamente

Sempre que criar ou alterar endpoints, execute:

```bash
npm run swagger
```

Isso vai regenerar o arquivo `swagger-output.json` com base nos comentários e estrutura de rotas do seu projeto.

---

## ➕ Como adicionar novas rotas

1. Crie o controller com o `Router` exportado dentro de `src/controllers/NomeController.ts`
2. Em `src/routes/nome.routes.ts`, importe o controller:

```ts
import { nomeRouter } from "../controllers/NomeController";
const router = Router();
router.use("/", nomeRouter);
export { router as nomeRouter };
```

3. Em `src/routes/index.ts`, registre a rota:

```ts
import { nomeRouter } from "./nome.routes";
router.use("/nome", nomeRouter);
```

4. Rode `npm run swagger` novamente se quiser atualizar a documentação.

---

## ✅ O que esse template já entrega

- ✅ Projeto com TypeScript e Express
- ✅ Estrutura MVC separada
- ✅ Tratamento global de erros
- ✅ Documentação Swagger automática com `swagger-autogen`
- ✅ Scripts para dev e build
- ✅ Pronto para escalar com autenticação, banco de dados, etc

---

## 📝 Requisitos

- Node.js 18+ recomendado
- `npm` ou `yarn`

---

## 📘 Licença

MIT © Seu Nome