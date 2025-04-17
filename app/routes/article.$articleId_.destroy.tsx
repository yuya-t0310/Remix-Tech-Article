import { ActionFunctionArgs } from "@remix-run/node";
import prisma from "../../db/prisma";
import invariant from "tiny-invariant";
import { LoaderFunctionArgs, redirect } from "react-router";
import { requireUserSession } from "../data/auth.server";
import { setFlashMessage } from "../utils/session";

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
  const deleteArticle = await prisma.article.findFirst({
    where: {
      id: parseInt(params.articleId),
    },
  });

  // 操作ユーザと著者ユーザが異なる場合トップページへリダイレクト
  if (parseInt(userId) != deleteArticle?.authorId) {
    return setFlashMessage(
      request,
      { color: "error", message: "無効な操作です。" },
      "/"
    );
  }

  // 削除実行
  await prisma.article.delete({
    where: {
      id: parseInt(params.articleId),
    },
  });
  return setFlashMessage(
    request,
    { color: "success", message: "記事を削除しました。" },
    "/"
  );
};
