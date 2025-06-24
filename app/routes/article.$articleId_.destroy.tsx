import { ActionFunctionArgs } from "@remix-run/node";
import prisma from "../db/prisma";
import invariant from "tiny-invariant";
import { LoaderFunctionArgs } from "react-router";
import { requireUserSession } from "../data/auth.server";
import { setFlashMessage } from "../utils/session";
import { deleteArticleById, findArticleById } from "../db/article";
import { deleteTagsByArticleId } from "../db/articleTag";
import { deleteFavoriteByArticleId } from "../db/favorite";

// GETリクエスト(URL直接打ち込み)が送信された場合のエラーハンドリング
export const loader = async ({ request }: LoaderFunctionArgs) => {
  return setFlashMessage(
    request,
    { color: "error", message: "無効な操作です。" },
    "/"
  );
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  // ログイン状態でなければトップページへリダイレクト
  const userId = await requireUserSession(request, "/");

  invariant(params.articleId, "Missing articleId params");
  const articleId = parseInt(params.articleId);
  const deleteArticle = await findArticleById(articleId);
  let message: { color: string; message: string };

  // 操作ユーザと著者ユーザが異なる場合トップページへリダイレクト
  if (parseInt(userId) != deleteArticle?.authorId) {
    return setFlashMessage(
      request,
      { color: "error", message: "無効な操作です。" },
      "/"
    );
  }

  // 削除処理
  message = { color: "success", message: "記事を削除しました。" };
  try {
    await prisma.$transaction(async () => {
      // 外部参照エラー対策として各削除関数にawaitを使用することで順序を保証する
      // Favoriteテーブルから削除
      await deleteFavoriteByArticleId(articleId);
      // ArticleTagテーブルから削除
      await deleteTagsByArticleId(articleId);
      // 記事削除
      await deleteArticleById(articleId);
    });
  } catch (error) {
    message = { color: "error", message: "削除に失敗しました。" };
  } finally {
    await prisma.$disconnect();
  }

  return setFlashMessage(request, message, "/");
};
