import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import prisma from "../../lib/prisma";
import invariant from "tiny-invariant";
import { requireUserSession } from "../data/auth.server";
import { setFlashMessage } from "../utils/session";
import ArticleForm from "../components/ArticleForm";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  // ログイン状態でなければトップページへリダイレクト
  const userId = await requireUserSession(request, "/");

  invariant(params.articleId, "Missing articleId param");
  const article = await prisma.article.findFirst({
    where: {
      id: parseInt(params.articleId),
    },
  });

  if (!article) {
    throw new Response("Not Found", { status: 404 });
  }

  // 操作ユーザと著者ユーザが異なる場合トップページへリダイレクト
  if (parseInt(userId) != article.authorId) {
    return setFlashMessage(
      request,
      { color: "error", message: "無効な操作です。" },
      "/"
    );
  }

  return { article };
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.articleId, "Missing articleId param");
  const formData = await request.formData();
  const update = Object.fromEntries(formData);

  const article = await prisma.article.update({
    where: {
      id: parseInt(params.articleId),
    },
    data: {
      title: update.title as string,
      content: update.content as string,
    },
  });

  let message = { color: "success", message: "編集に成功しました。" };
  // TODO: アプリケーションエラーになる
  if (!article) {
    message = { color: "error", message: "編集に失敗しました。" };
  }

  return setFlashMessage(request, message, `/article/${params.articleId}`);
};

export default function EditArticle() {
  const { article } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="text-xl font-bold">記事編集</div>

      <div className="m-4">
        <ArticleForm article={article} />
      </div>
    </>
  );
}
