import DB from '../utils/DB/DB';

export const getUserPosts = async (userId: string, db: DB) => {
  return await db.posts.findMany({
    key: 'userId',
    equals: userId,
  });
};

export const getUserProfiles = async (userId: string, db: DB) => {
  return await db.profiles.findMany({
    key: 'userId',
    equals: userId,
  });
};

export const getProfileMemberType = async (memberTypeId: string, db: DB) => {
  return await db.memberTypes.findOne({
    key: 'id',
    equals: memberTypeId,
  });
};
