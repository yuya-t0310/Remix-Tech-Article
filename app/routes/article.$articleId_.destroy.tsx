import { ActionFunctionArgs } from "@remix-run/node";
import prisma from "../../lib/prisma";
import invariant from "tiny-invariant";
import { LoaderFunctionArgs, redirect } from "react-router";
import { requireUserSession } from "../data/auth.server";
import { getSession, commitSession } from "../sessions";

// GETリクエスト(URL直接打ち込み)が送信された場合のエラーハンドリング
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  session.flash("error", "無効な操作です。");
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
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
    return redirect("/");
  }

  // 削除実行
  await prisma.article.delete({
    where: {
      id: parseInt(params.articleId),
    },
  });
  console.log("article id:", params.articleId, "deleted!");
  return redirect("/");
};
