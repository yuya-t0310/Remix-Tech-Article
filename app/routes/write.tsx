import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import prisma from "../../lib/prisma";
import { requireUserSession } from "../data/auth.server";

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

  await prisma.article.create({
    data: {
      title: insert.title as string,
      authorId: parseInt(userId),
      content: insert.content as string,
      viewCount: 0,
    },
  });
  return redirect(`/`);
};

export default function WriteArticle() {
  return (
    <>
      <div>Create New Article</div>
      <div>
        <Form id="article-form" method="post">
          <p>
            <span>Title</span>
            <input
              name="title"
              type="text"
              aria-label="Title"
              placeholder="Title"
            />
          </p>
          <p>
            <span>content</span>
            <textarea
              name="content"
              rows={12}
              placeholder="Write your article..."
            ></textarea>
          </p>
          <p>
            <button type="submit">投稿</button>
          </p>
        </Form>
      </div>
    </>
  );
}
