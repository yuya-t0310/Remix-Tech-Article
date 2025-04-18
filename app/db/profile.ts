import prisma from "./prisma";

/**
 * userIdからプロフィールを取得
 * @param userId
 * @returns
 */
export const findProfile = async (userId: number) => {
  return prisma.profile.findFirst({
    where: {
      userId: userId,
    },
  });
};

/**
 * Profileに空データを作る
 * @param userId
 * @returns
 */
export const createProfile = async (userId: number) => {
  return prisma.profile.create({
    data: {
      name: "",
      bio: "",
      userId: userId,
    },
  });
};

/**
 * Profileを更新する
 * @param userId
 * @param name
 * @param bio
 * @returns
 */
export const updateProfile = async (
  userId: number,
  name: string,
  bio: string
) => {
  return prisma.profile.update({
    where: {
      userId: userId,
    },
    data: {
      name: name,
      bio: bio,
    },
  });
};
