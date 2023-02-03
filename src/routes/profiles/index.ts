import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { validate } from 'uuid';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type {
  ProfileEntity,
  CreateProfileDTO,
  ChangeProfileDTO,
} from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
    return fastify.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profileId = (request.params as { id: string }).id;

      return fastify.db.profiles
        .findOne({ key: 'id', equals: profileId })
        .then((profile) => {
          if (!profile) {
            throw reply.notFound();
          }

          return profile;
        });
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const body = request.body as CreateProfileDTO;

      if (!validate(body.userId)) {
        throw reply.badRequest('id must be valid uuid');
      }

      const memberType = await fastify.db.memberTypes.findOne({
        key: 'id',
        equals: body.memberTypeId,
      });

      if (!memberType) {
        throw reply.badRequest();
      }

      const user = await fastify.db.profiles.findOne({
        key: 'userId',
        equals: body.userId,
      });

      if (user) {
        throw reply.badRequest('user already has a profile');
      }

      return fastify.db.profiles.create(body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profileId = (request.params as { id: string }).id;

      if (!validate(profileId)) {
        throw reply.badRequest('id must be valid uuid');
      }

      return fastify.db.profiles.delete(profileId);
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profileId = (request.params as { id: string }).id;

      if (!validate(profileId)) {
        throw reply.badRequest('id must be valid uuid');
      }

      return fastify.db.profiles.change(profileId, request.body as ChangeProfileDTO);
    }
  );
};

export default plugin;
