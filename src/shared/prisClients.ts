// src/shared/prismaClient.ts
import { PrismaClient } from "../generated/prisma";

// Extensão do PrismaClient para adicionar logs e outras funções
class PrismaClientExtended extends PrismaClient {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' 
        ? [
            { emit: 'event', level: 'query' },
            { emit: 'stdout', level: 'info' },
            { emit: 'stdout', level: 'warn' },
            { emit: 'stdout', level: 'error' },
          ]
        : undefined,
    });

    // Log de queries apenas em ambiente de desenvolvimento
    // if (process.env.NODE_ENV === 'development') {
    //   this.$on('query', (e: any) => {
    //     console.log('Query: ' + e.query);
    //     console.log('Params: ' + e.params);
    //     console.log('Duration: ' + e.duration + 'ms');
    //   });
    // }
  }

  // Método de limpeza para conectar e desconectar automaticamente
  async executeWithConnection<T>(callback: () => Promise<T>): Promise<T> {
    try {
      await this.$connect();
      return await callback();
    } finally {
      await this.$disconnect();
    }
  }
}

// Singleton para garantir que apenas uma instância seja criada
const prisma = new PrismaClientExtended();

export { prisma };