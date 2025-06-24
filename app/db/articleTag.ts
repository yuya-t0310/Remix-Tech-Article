import prisma from "./prisma";

/**
 * 指定された記事IDに紐づくタグ関連（ArticleTag）をすべて削除
 * @param {number} articleId 記事のID
 */
export const deleteTagsByArticleId = async (articleId: number): Promise<void> => {
  await prisma.articleTag.deleteMany({
    where: {
      articleId: articleId,
    },
  });
};
