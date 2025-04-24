import prisma from "./prisma";

/**
 * 最新記事を取得
 * selectオプションを使用してパスワード等を取得しないようにする
 * @returns
 */
export const findLatestArticles = async () => {
  return prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      author: {
        select: {
          profile: {
            select: {
              name: true,
            },
          },
        },
      },
      favoritedBy: {},
    },
  });
};

/**
 * IDから記事を取得
 * @param id
 * @returns
 */
export const findArticleById = async (id: number) => {
  return prisma.article.findFirst({
    where: {
      id: id,
    },
  });
};

/**
 * authorIdから記事を取得
 * @param authorId
 * @returns
 */
export const findArticleByAuthorId = async (authorId: number) => {
  return prisma.article.findMany({
    where: { authorId: authorId },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          profile: {
            select: {
              name: true,
            },
          },
        },
      },
      favoritedBy: {},
    },
  });
};

/**
 * IDから記事を取得
 * @param id
 * @returns
 */
export const findArticleDetailById = async (id: number) => {
  return prisma.article.findFirst({
    where: {
      id: id,
    },
    include: {
      author: {
        select: {
          profile: {
            select: {
              name: true,
            },
          },
        },
      },
      favoritedBy: {},
    },
  });
};

/**
 * 記事を追加する
 * @param title
 * @param authorId
 * @param content
 * @param tags
 * @returns
 */
export const createArticle = async (
  title: string,
  authorId: number,
  content: string,
  tags: string[]
) => {
  return await prisma.article.create({
    data: {
      title: title,
      authorId: authorId,
      content: content,
      viewCount: 0,
      // ArticleTag
      tags: {
        create: tags.map(tag => ({
          // articleIdは自動的にArticleと紐づけられる
          // tagIdはTagテーブルに存在すれば取得し、存在しなければcreateする
          // Tag
          tag: {
            connectOrCreate: {
                where: { name: tag },
                create: { name: tag },
            }
          }
        }))
      }
    },
    // 作成されたタグ情報の取得
    include : {
      tags: {
        include: {
          tag: true
        }
      }
    }
  });
};

/**
 * 指定IDのタイトルと内容を更新
 * @param id
 * @param title
 * @param content
 * @returns
 */
export const updateArticleById = async (
  id: number,
  title: string,
  content: string
) => {
  return prisma.article.update({
    where: {
      id: id,
    },
    data: {
      title: title,
      content: content,
    },
  });
};

/**
 * viewCountをインクリメント updatedAtは更新しない
 * @param id
 * @param date
 * @returns
 */
export const incrementArticleViewCount = async (id: number, date: Date) => {
  return prisma.article.update({
    where: {
      id: id,
    },
    data: {
      viewCount: {
        increment: 1,
      },
      // 現在の値を設定
      updatedAt: date,
    },
  });
};

/**
 * IDを指定して記事を削除
 * TODO: Favoriteからも削除する必要アリ
 * @param id
 * @returns
 */
export const deleteArticleById = async (id: number) => {
  return prisma.article.delete({
    where: {
      id: id,
    },
  });
};
