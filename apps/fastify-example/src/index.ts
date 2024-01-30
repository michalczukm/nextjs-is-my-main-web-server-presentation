import fastify, { FastifyInstance } from 'fastify';
import { routes } from './routes';

export const server: FastifyInstance = fastify({ logger: true });

server.register(routes, { prefix: '/api' });

export const run = () => {
  server.listen({
    port: +(process.env.PORT || 3000),
  }, (error, address) => {
    if (error) {
      console.error(`[Fastify] Server init failed.`, error);
      process.exit(1);
    }

    console.info(`[Fastify] Server listening at `, address);
  });
};

run();
