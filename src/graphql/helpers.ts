import DB from '../utils/DB/DB';

export const getUserPosts = async (userId: string, db: DB) => {
  return await db.posts.findMany({
    key: 'userId',
    equals: userId,
  });
};

export const getUserProfile = async (userId: string, db: DB) => {
  return await db.profiles.findOne({
    key: 'userId',
    equals: userId,
  });
};

export const getProfileMemberType = async (db: DB, memberTypeId?: string) => {
  if (!memberTypeId) {
    return null;
  }
  return await db.memberTypes.findOne({
    key: 'id',
    equals: memberTypeId,
  });
};

export const getUserSubscribedOn = async (userId: string, db: DB) => {
  const users = await db.users.findMany();

  return users.filter(({ subscribedToUserIds }) =>
    subscribedToUserIds.includes(userId)
  );
};
