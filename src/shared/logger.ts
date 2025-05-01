// src/shared/logger.ts
import winston from 'winston';
import { env } from '../config/env';

// Configuração de níveis de log
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Configuração de cores para cada nível (para o console)
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Adiciona cores ao Winston
winston.addColors(colors);

// Determina o nível de log baseado no ambiente
const level = () => {
  const environment = env.NODE_ENV || 'development';
  const isDevelopment = environment === 'development';
  return isDevelopment ? 'debug' : 'info';
};

// Formato customizado para os logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Configuração dos transportes (onde os logs serão armazenados)
const transports = [
  // Console para todos os logs
  new winston.transports.Console(),
  
  // Arquivos para logs específicos
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  new winston.transports.File({ filename: 'logs/all.log' }),
];

// Cria a instância do logger
const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default Logger;