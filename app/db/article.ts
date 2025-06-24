import prisma from "./prisma";
import type { selectedArticle, createdArticle, updatedArticle } from "../types/articleTypes";
import { deleteTagsByArticleId } from "./articleTag";
import type { Article } from "@prisma/client";

/**
 * 最新記事を取得
 * selectオプションを使用してパスワード等を取得しないようにする
 * findManyは常に配列を返す
 * @returns {selectedArticle[]} latestArticles 最新記事の配列
 */
export const findLatestArticles = async (): Promise<selectedArticle[]> => {
  return await prisma.article.findMany({
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
      // ArticleTag
      tags: {
        // Tag
        include: {
          tag: true
        }
      },
    },
  });
};

/**
 * IDから記事を取得
 * @param {number} id 記事のID
 * @returns {selectedArticle | null} article 検索された記事
 */
export const findArticleById = async (id: number): Promise<selectedArticle | null> => {
  return await prisma.article.findFirst({
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
      // ArticleTag
      tags: {
        // Tag
        include: {
          tag: true
        }
      },
    }
  });
};

/**
 * authorIdから記事を取得
 * @param {number} authorId 著者のユーザID
 * @returns {selectedArticle[]} articles 取得された記事 
 */
export const findArticleByAuthorId = async (authorId: number): Promise<selectedArticle[]> => {
  return await prisma.article.findMany({
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
      tags: {
        include: {
          tag: true
        }
      },
    },
  });
};

/**
 * tagから記事を取得
 * @param {tag} tag 記事に付けられたタグ
 * @return {selectedArticle[]} articles 取得された記事
 */
export const findArticleByTag = async (tag: string): Promise<selectedArticle[]> => {
  return await prisma.article.findMany({
    where: {
      tags: {
        some: {
          tag: {
            name: tag,
          },
        },
      },
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
      tags: {
        include: {
          tag: true
        }
      },
    },
  })
}

/**
 * 記事を追加する
 * @param {string} title 記事タイトル
 * @param {number} authorId ユーザID
 * @param {string} content 記事内容
 * @param {string[]} tags タグ
 * @returns {createdArticle} article 作成された記事
 */
export const createArticle = async (
  title: string,
  authorId: number,
  content: string,
  tags: string[]
): Promise<createdArticle> => {
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
 * @param {number} id 記事のID
 * @param {string} title 記事タイトル
 * @param {string} content 記事内容
 * @param {string[]} tags タグ
 * @returns {updatedArticle} updatedArticle 更新後の記事
 */
export const updateArticleById = async (
  id: number,
  title: string,
  content: string,
  tags: string[]
): Promise<Article> => {
  return await prisma.article.update({
    where: {
      id: id,
    },
    data: {
      title: title,
      content: content,
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
 * viewCountをインクリメント updatedAtは更新しない
 * @param {number} id 記事のID
 * @param {Date} date 現在のupdatedAt
 * @returns {Article} updatedArticle 更新後の記事
 */
export const incrementArticleViewCount = async (id: number, date: Date): Promise<Article> => {
  return await prisma.article.update({
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
 * TODO: Favorite, Tag, ArticleTagからも削除する必要アリ
 * @param id
 * @returns
 */
export const deleteArticleById = async (id: number): Promise<void> => {
  await prisma.article.delete({
    where: {
      id: id,
    },
  });
};

