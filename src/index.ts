import "reflect-metadata";
import "./shared/container";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middlewares/errorHandler";
import { loggerMiddleware } from "./middlewares/loggerMiddleware";
import router from "./routes";
import { env } from "./config/env";
import Logger from "./shared/logger";

// Inicializa o express
const app = express();
const PORT = parseInt(env.PORT || "3000", 10);

// Middlewares de segurança e performance
app.use(helmet()); // Adiciona headers de segurança
app.use(compression()); // Comprime as respostas
app.use(cors({
  origin:  "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Limites de taxa para prevenir abuso da API
const limiter = rateLimit({
  windowMs: parseInt( "900000", 10), // 15 minutos por padrão
  max: parseInt( "100", 10), // 100 requisições por janela
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas requisições, tente novamente mais tarde" }
});
app.use(limiter);

// Middleware para fazer parse do corpo das requisições
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use(loggerMiddleware);

// Rotas da API
app.use( router);

// Handler de erros global
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
// Trat