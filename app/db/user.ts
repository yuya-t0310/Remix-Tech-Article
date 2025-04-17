import prisma from "./prisma";

/**
 * ユーザ登録
 * @param email
 * @param password
 * @param name
 * @returns
 */
export const createUser = async (
  email: string,
  password: string,
  name: string
) => {
  return prisma.user.create({
    // Nested writesで子要素のProfileも同時に生成(トランザクション処理と同義となる)
    data: {
      email: email,
      password: password,
      profile: {
        create: {
          name: name,
          bio: "",
          // userIdは自動的にUserと関連付けられる
        },
      },
    },
  });
};

/**
 * メールアドレスでユーザ検索
 * @param email
 * @returns
 */
export const findUserByEmail = async (email: string) => {
  return prisma.user.findFirst({
    where: {
      email: email,
    },
  });
};
