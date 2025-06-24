import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import prisma from "../db/prisma";
import invariant from "tiny-invariant";
import { requireUserSession } from "../data/auth.server";
import { setFlashMessage } from "../utils/session";
import ArticleForm from "../components/ArticleForm";
import { findArticleById, updateArticleById } from "../db/article";
import { deleteTagsByArticleId } from "../db/articleTag";
import Article from "./article.$articleId";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  // ログイン状態でなければトップページへリダイレクト
  const userId = await requireUserSession(request, "/");

  invariant(params.articleId, "Missing articleId param");

  // 編集対象の記事を取得
  const article = await findArticleById(parseInt(params.articleId));

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
  const articleId = parseInt(params.articleId);
  const formData = await request.formData();
  const update = Object.fromEntries(formData);
  const tags: string[] = [];
  let message: { color: string; message: string };

  // タグ配列の作成
  for (let i = 0; formData.has(`tag_${i}`); i++) {
    const tag: string = formData.get(`tag_${i}`) as string;
    if (tag && tag.trim() !== "") {
      tags.push(tag);
    }
  }

  // 更新処理
  message = { color: "success", message: "編集に成功しました。" };
  try {
    await prisma.$transaction(async () => {
      // ArticleTagテーブルから削除
      deleteTagsByArticleId(articleId);
      // 記事更新
      const article = updateArticleById(
        articleId,
        update.title as string,
        update.content as string,
        tags
      );
    });
  } catch (error) {
    message = { color: "error", message: "編集に失敗しました。" };
  } finally {
    await prisma.$disconnect();
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
