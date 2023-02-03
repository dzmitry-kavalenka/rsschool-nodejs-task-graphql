import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type {
  MemberTypeEntity,
  ChangeMemberTypeDTO,
} from '../../utils/DB/entities/DBMemberTypes';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    return fastify.db.memberTypes.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const memberTypeId = (request.params as { id: string }).id;

      return fastify.db.memberTypes
        .findOne({ key: 'id', equals: memberTypeId })
        .then((memberType) => {
          if (!memberType) {
            throw reply.notFound();
          }

          return memberType;
        });
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const memberTypeId = (request.params as { id: string }).id;

      const memberType = await fastify.db.memberTypes.findOne({
        key: 'id',
        equals: memberTypeId,
      });

      if (!memberType) {
        throw reply.badRequest();
      }

      return fastify.db.memberTypes.change(
        memberTypeId,
        request.body as ChangeMemberTypeDTO
      );
    }
  );
};

export default plugin;
