import prisma from "./prisma";

/**
 * Favoriteテーブルを検索する
 * @param userId
 * @param articleId
 * @returns
 */
export const findFavorite = async (userId: number, articleId: number) => {
  return prisma.favorite.findFirst({
    where: {
      userId: userId,
      articleId: articleId,
    },
  });
};

/**
 * 記事をお気に入り登録
 * @param userId
 * @param articleId
 * @returns
 */
export const addFavorite = async (userId: number, articleId: number) => {
  return prisma.favorite.create({
    data: {
      userId: userId,
      articleId: articleId,
    },
  });
};

/**
 * 記事をお気に入りから削除
 * @param userId
 * @param articleId
 * @returns
 */
export const removeFavorite = async (userId: number, articleId: number) => {
  return prisma.favorite.delete({
    where: {
      favoriteId: {
        userId: userId,
        articleId: articleId,
      },
    },
  });
};

/**
 * 記事IDを指定してFavoriteテーブルから削除
 * @param {number} articleId 記事のID
 */
export const deleteFavoriteByArticleId = async (articleId: number): Promise<void> => {
  await prisma.favorite.deleteMany({
    where: {
      articleId: articleId
    }
  })
}
