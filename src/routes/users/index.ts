import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { validate } from 'uuid';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type {
  CreateUserDTO,
  ChangeUserDTO,
  UserEntity,
} from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return fastify.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const userId = (request.params as { id: string }).id;

      return fastify.db.users
        .findOne({ key: 'id', equals: userId })
        .then((user) => {
          if (!user) {
            throw reply.notFound();
          }

          return user;
        });
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      return fastify.db.users.create(request.body as CreateUserDTO);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const userId = (request.params as { id: string }).id;

      if (!validate(userId)) {
        throw reply.badRequest('id must be valid uuid');
      }

      const allUsers = await fastify.db.users.findMany();
      const postsToRemove = await fastify.db.posts.findMany({
        key: 'userId',
        equals: userId,
      });
      const profilesToRemove = await fastify.db.profiles.findMany({
        key: 'userId',
        equals: userId,
      });

      const usersSubOn = allUsers.filter(({ subscribedToUserIds }) =>
        subscribedToUserIds.includes(userId)
      );
      const removeSubsArr = usersSubOn.map(({ id, subscribedToUserIds }) =>
        fastify.db.users.change(id, {
          subscribedToUserIds: subscribedToUserIds.filter(
            (sub) => sub !== userId
          ),
        })
      );
      const removeUsersPosts = postsToRemove.map(({ id }) =>
        fastify.db.posts.delete(id)
      );
      const removeUsersProfiles = profilesToRemove.map(({ id }) =>
        fastify.db.profiles.delete(id)
      );

      await Promise.all([
        ...removeSubsArr,
        ...removeUsersPosts,
        ...removeUsersProfiles,
      ]);

      return fastify.db.users.delete(userId).then((user) => user);
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const userId = (request.body as { userId: string }).userId;
      const userIdToSub = (request.params as { id: string }).id;

      if (!validate(userIdToSub) || !validate(userId)) {
        throw reply.badRequest('id must be valid uuid');
      }

      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: userId,
      });

      const userToSub = await fastify.db.users.findOne({
        key: 'id',
        equals: userIdToSub,
      });

      if (!user || !userToSub) {
        throw reply.notFound();
      }

      if (user.subscribedToUserIds.includes(userIdToSub)) {
        throw reply.badRequest('user is already subscribed');
      }

      return fastify.db.users.change(userId, {
        subscribedToUserIds: [...user.subscribedToUserIds, userIdToSub],
      });
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const userId = (request.body as { userId: string }).userId;
      const userIdToUnSub = (request.params as { id: string }).id;

      if (!validate(userIdToUnSub) || !validate(userId)) {
        throw reply.badRequest('id must be valid uuid');
      }

      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: userId,
      });

      const userToUnSub = await fastify.db.users.findOne({
        key: 'id',
        equals: userIdToUnSub,
      });

      if (!user || !userToUnSub) {
        throw reply.notFound();
      }

      if (!user.subscribedToUserIds.includes(userIdToUnSub)) {
        throw reply.badRequest('user is not subscribed');
      }

      return fastify.db.users.change(userId, {
        subscribedToUserIds: user.subscribedToUserIds.filter(
          (id) => id !== userIdToUnSub
        ),
      });
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const userId = (request.params as { id: string }).id;

      if (!validate(userId)) {
        throw reply.badRequest('id must be valid uuid');
      }

      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: userId,
      });

      if (!user) {
        throw reply.notFound();
      }

      return fastify.db.users.change(userId, request.body as ChangeUserDTO);
    }
  );
};

export default plugin;
