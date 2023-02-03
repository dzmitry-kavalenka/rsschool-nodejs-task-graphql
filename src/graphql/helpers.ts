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

export const getProfilesUserSubscribedOn = async (userId: string, db: DB) => {
  const users = await db.users.findMany();

  const followingUsers = users.filter(({ subscribedToUserIds }) =>
    subscribedToUserIds.includes(userId)
  );

  const [followingUsersProfiles] = await Promise.all(
    followingUsers.map(({ id }) =>
      db.profiles.findMany({ key: 'userId', equals: id })
    )
  );

  return followingUsersProfiles;
};
