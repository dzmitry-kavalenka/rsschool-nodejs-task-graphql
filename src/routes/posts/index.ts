import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { validate } from 'uuid';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type {
  PostEntity,
  CreatePostDTO,
  ChangePostDTO,
} from '../../utils/DB/entities/DBPosts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    return fastify.db.posts.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const postId = (request.params as { id: string }).id;

      return fastify.db.posts
        .findOne({ key: 'id', equals: postId })
        .then((post) => {
          if (!post) {
            throw reply.notFound();
          }

          return post;
        });
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const body = request.body as CreatePostDTO;

      if (!validate(body.userId)) {
        throw reply.badRequest('id must be valid uuid');
      }

      return fastify.db.posts.create(body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const postId = (request.params as { id: string }).id;

      if (!validate(postId)) {
        throw reply.badRequest('id must be valid uuid');
      }

      return fastify.db.posts.delete(postId);
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const postId = (request.params as { id: string }).id;

      if (!validate(postId)) {
        throw reply.badRequest('id must be valid uuid');
      }

      const post = await fastify.db.posts.findOne({
        key: 'id',
        equals: postId,
      });

      if (!post) {
        throw reply.notFound();
      }

      const updateBody = request.body as ChangePostDTO;

      return fastify.db.posts.change(postId, updateBody);
    }
  );
};

export default plugin;
