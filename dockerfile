FROM node:22-alpine AS builder

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código-fonte
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Estágio de produção
FROM node:22-alpine AS production

WORKDIR /app

# Copiar apenas arquivos necessários
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/generated ./src/generated

# Definir variáveis de ambiente para produção
ENV NODE_ENV=production

# Expor porta
EXPOSE 3000

# Iniciar a aplicação
CMD ["npm", "start"]
