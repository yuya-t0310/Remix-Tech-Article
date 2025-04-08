import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import prisma from "../../lib/prisma";
import { requireUserSession } from "../data/auth.server";
import { setFlashMessage } from "../utils/session";

// ログイン状態でなければトップページへリダイレクト
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserSession(request, "/");
  return null;
};

// DBに登録
export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserSession(request, "/");
  const formData = await request.formData();
  const insert = Object.fromEntries(formData);

  const article = await prisma.article.create({
    data: {
      title: insert.title as string,
      authorId: parseInt(userId),
      content: insert.content as string,
      viewCount: 0,
    },
  });

  let message = { color: "success", message: "投稿に成功しました。" };
  // TODO: アプリケーションエラーになる
  if (!article) {
    message = { color: "error", message: "投稿に失敗しました。" };
  }

  return setFlashMessage(request, message, "/");
};

export default function WriteArticle() {
  return (
    <>
      <div className="text-xl font-bold">記事作成</div>
      <div>
        <Form id="article-form" method="post">
          <p>
            <span>タイトル</span>
            <input
              name="title"
              type="text"
              aria-label="Title"
              placeholder="タイトル"
            />
          </p>
          <p>
            <span>内容</span>
            <textarea name="content" rows={12} placeholder="本文"></textarea>
          </p>
          <p>
            <button type="submit">投稿</button>
          </p>
        </Form>
      </div>
    </>
  );
}
