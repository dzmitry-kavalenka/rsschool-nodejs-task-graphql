import { FastifyReply } from 'fastify';
import { validate } from 'uuid';
import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLError,
  GraphQLFloat,
} from 'graphql';
import DB from '../utils/DB/DB';
import { ChangeUserDTO, CreateUserDTO } from '../utils/DB/entities/DBUsers';
import { CreateProfileDTO, ChangeProfileDTO } from '../utils/DB/entities/DBProfiles';

const userType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLID) },
  }),
});

const userInputType = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

const profileType = new GraphQLObjectType({
  name: 'ProfileType',
  fields: () => ({
    id: { type: GraphQLID },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLFloat },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
    userId: { type: GraphQLString },
  }),
});

const profileInputType = new GraphQLInputObjectType({
  name: 'ProfileInput',
  fields: {
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLFloat },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
    userId: { type: GraphQLString },
  },
});

const queryType = new GraphQLObjectType({
  name: 'rootQuery',
  fields: () => ({
    getAllUsers: {
      type: new GraphQLList(userType),
      resolve: async (
        _source: string,
        _args: any,
        { app: { db } }: { app: { db: DB } }
      ) => {
        return await db.users.findMany();
      },
    },
    getUserById: {
      type: userType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve: async (
        _source: string,
        { id }: { id: string },
        { app: { db } }: { app: { db: DB; reply: FastifyReply } }
      ) => {
        const user = await db.users.findOne({ key: 'id', equals: id });

        if (!user) {
          return new GraphQLError('user not found');
        }

        return user;
      },
    },
    getAllProfiles: {
      type: new GraphQLList(profileType),
      resolve: async (
        _source: string,
        _args: unknown,
        { app: { db } }: { app: { db: DB } }
      ) => {
        return await db.profiles.findMany();
      },
    },
    getProfileById: {
      type: profileType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve: async (
        _source: string,
        { id }: { id: string },
        { app: { db } }: { app: { db: DB; reply: FastifyReply } }
      ) => {
        const profile = await db.profiles.findOne({ key: 'id', equals: id });

        if (!profile) {
          return new GraphQLError('profile not found');
        }

        return profile;
      },
    },
  }),
});

const mutationType = new GraphQLObjectType({
  name: 'rootMutation',
  fields: () => ({
    createUser: {
      type: userType,
      args: {
        input: {
          type: userInputType,
        },
      },
      resolve: async (
        _source: string,
        { input }: { input: CreateUserDTO },
        { app: { db } }: { app: { db: DB } }
      ) => {
        return await db.users.create(input);
      },
    },
    deleteUser: {
      type: userType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve: async (
        _source: string,
        { id }: { id: string },
        { app: { db } }: { app: { db: DB } }
      ) => {
        if (!validate(id)) {
          return new GraphQLError('id must be valid uuid');
        }

        const allUsers = await db.users.findMany();
        const postsToRemove = await db.posts.findMany({
          key: 'userId',
          equals: id,
        });
        const profilesToRemove = await db.profiles.findMany({
          key: 'userId',
          equals: id,
        });

        const usersSubOn = allUsers.filter(({ subscribedToUserIds }) =>
          subscribedToUserIds.includes(id)
        );
        const removeSubsArr = usersSubOn.map(({ id, subscribedToUserIds }) =>
          db.users.change(id, {
            subscribedToUserIds: subscribedToUserIds.filter(
              (sub) => sub !== id
            ),
          })
        );
        const removeUsersPosts = postsToRemove.map(({ id }) =>
          db.posts.delete(id)
        );
        const removeUsersProfiles = profilesToRemove.map(({ id }) =>
          db.profiles.delete(id)
        );

        await Promise.all([
          ...removeSubsArr,
          ...removeUsersPosts,
          ...removeUsersProfiles,
        ]);

        return await db.users.delete(id);
      },
    },
    subscribeTo: {
      type: userType,
      args: {
        userId: { type: GraphQLID },
        userIdToSub: { type: GraphQLID },
      },
      resolve: async (
        _source: string,
        { userId, userIdToSub }: { userId: string; userIdToSub: string },
        { app: { db } }: { app: { db: DB } }
      ) => {
        if (!validate(userIdToSub) || !validate(userId)) {
          return new GraphQLError('id must be valid uuid');
        }

        const user = await db.users.findOne({ key: 'id', equals: userId });

        const userToSub = await db.users.findOne({
          key: 'id',
          equals: userIdToSub,
        });

        if (!user || !userToSub) {
          return new GraphQLError('user not found');
        }

        if (user.subscribedToUserIds.includes(userIdToSub)) {
          return new GraphQLError('user is already subscribed');
        }

        return await db.users.change(userId, {
          subscribedToUserIds: [...user.subscribedToUserIds, userIdToSub],
        });
      },
    },
    unsubscribeFrom: {
      type: userType,
      args: {
        userId: { type: GraphQLID },
        userIdToUnSub: { type: GraphQLID },
      },
      resolve: async (
        _source: string,
        { userId, userIdToUnSub }: { userId: string; userIdToUnSub: string },
        { app: { db } }: { app: { db: DB } }
      ) => {
        if (!validate(userIdToUnSub) || !validate(userId)) {
          return new GraphQLError('id must be valid uuid');
        }

        const user = await db.users.findOne({
          key: 'id',
          equals: userId,
        });

        const userToUnSub = await db.users.findOne({
          key: 'id',
          equals: userIdToUnSub,
        });

        if (!user || !userToUnSub) {
          return new GraphQLError('user not found');
        }

        if (!user.subscribedToUserIds.includes(userIdToUnSub)) {
          return new GraphQLError('user is not subscribed');
        }

        return await db.users.change(userId, {
          subscribedToUserIds: user.subscribedToUserIds.filter(
            (id) => id !== userIdToUnSub
          ),
        });
      },
    },
    updateUser: {
      type: userType,
      args: {
        id: { type: GraphQLID },
        input: { type: userInputType },
      },
      resolve: async (
        _source: string,
        { input, id }: { id: string; input: ChangeUserDTO },
        { app: { db } }: { app: { db: DB } }
      ) => {
        if (!validate(id)) {
          return new GraphQLError('id must be valid uuid');
        }

        const user = await db.users.findOne({
          key: 'id',
          equals: id,
        });

        if (!user) {
          return new GraphQLError('user not found');
        }

        return await db.users.change(id, input);
      },
    },
    createProfile: {
      type: profileType,
      args: {
        input: {
          type: profileInputType,
        },
      },
      resolve: async (
        _source: string,
        { input }: { input: CreateProfileDTO },
        { app: { db } }: { app: { db: DB } }
      ) => {
        if (!validate(input.userId)) {
          return new GraphQLError('id must be valid uuid');
        }
  
        const memberType = await db.memberTypes.findOne({
          key: 'id',
          equals: input.memberTypeId,
        });
  
        if (!memberType) {
          return new GraphQLError('member type is not found');
        }
  
        const user = await db.profiles.findOne({
          key: 'userId',
          equals: input.userId,
        });
  
        if (user) {
          return new GraphQLError('user already has a profile');
        }
  
        return await db.profiles.create(input);
      },
    },
    deleteProfile: {
      type: profileType,
      args: {
        id: { type: GraphQLID }
      },
      resolve: async (
        _source: string,
        { id }: { id: string },
        { app: { db } }: { app: { db: DB } }
      ) => {
        if (!validate(id)) {
         return new GraphQLError('id must be valid uuid');
        }
  
        return await db.profiles.delete(id);
      },
    },
    updateProfile: {
      type: profileType,
      args: {
        id: { type: GraphQLID },
        input: { type: profileInputType },
      },
      resolve: async (
        _source: string,
        { id, input }: { id: string, input: ChangeProfileDTO },
        { app: { db } }: { app: { db: DB } }
      ) => {
        if (!validate(id)) {
          return new GraphQLError('id must be valid uuid');
        }
  
        return await db.profiles.change(id, input);
      },
    }
  }),
});

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
  types: [userType, userInputType],
});

export default schema;
