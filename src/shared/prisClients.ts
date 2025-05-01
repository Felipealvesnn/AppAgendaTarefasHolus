// src/shared/prismaClient.ts
import { PrismaClient } from "../generated/prisma";

// Extensão do PrismaClient para adicionar logs e outras funções
class PrismaClientExtended extends PrismaClient {
  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });
}
}

    // Log de queries apenas em ambiente de desenvolvimento