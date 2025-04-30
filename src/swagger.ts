import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Minha API',
    description: 'Documentação gerada automaticamente',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const routes = ['./src/index.ts']; // ou './src/routes/index.ts' se você separou as rotas

swaggerAutogen()(outputFile, routes, doc);
