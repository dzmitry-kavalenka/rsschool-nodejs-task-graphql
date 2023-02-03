import { join } from 'path';
import AutoLoad from '@fastify/autoload';
import { FastifyPluginAsync } from 'fastify';
import mercurius from 'mercurius';
import schema from './graphql/schema';

const app: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: {},
  });

  fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: {},
  });

  fastify.register(mercurius, {
    schema,
    graphiql: true,
  });
};

export default app;
