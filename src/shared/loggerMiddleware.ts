// src/middlewares/loggerMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import Logger from '../shared/logger';

// Cria um stream para o Morgan que escreve para o Winston
const stream = {
  write: (message: string) => Logger.http(message.trim()),
};

// Middleware do Morgan que usa nosso stream customizado
const morganMiddleware = morgan(
  // Define o formato do log para incluir:
  // - Método HTTP
  // - URL
  // - Status de resposta
  // - Tempo de resposta
  // - Tamanho da resposta
  ':method :url :status :res[content-length] - :response-time ms',
  { stream }
);

// Middleware para registrar detalhes das requisições
export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Registra o ID da requisição e outras informações úteis
  const requestId = req.headers['x-request-id'] || `req-${Date.now()}`;
  
  // Adiciona o ID da requisição aos logs
  res.locals.requestId = requestId;
  
  // Registra o início da requisição
  Logger.info(`[${requestId}] Requisição iniciada: ${req.method} ${req.url}`);
  
  // Captura o momento de finalização da resposta
  res.on('finish', () => {
    Logger.info(
      `[${requestId}] Requisição finalizada: ${req.method} ${req.url} ${res.statusCode}`
    );
  });

  // Passa para o middleware do Morgan
  morganMiddleware(req, res, next);
};