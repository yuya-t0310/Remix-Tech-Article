import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, redirect, useLoaderData } from "@remix-run/react";
import prisma from "../../lib/prisma";
import invariant from "tiny-invariant";
import { requireUserSession } from "../data/auth.server";

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
    return redirect("/");
  }

  return Response.json({ article });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.articleId, "Missing articleId param");
  const formData = await request.formData();
  const update = Object.fromEntries(formData);

  await prisma.article.update({
    where: {
      id: parseInt(params.articleId),
    },
    data: {
      title: update.title as string,
      content: update.content as string,
    },
  });
  return redirect(`/article/${params.articleId}`);
};

export default function EditArticle() {
  const { article } = useLoaderData<typeof loader>();
  console.log(article);

  return (
    <>
      <div>Edit Article</div>
      <div>
        <Form id="article-form" method="post">
          <p>
            <span>Title</span>
            <input
              name="title"
              type="text"
              aria-label="Title"
              placeholder="Title"
              defaultValue={article.title}
            ></input>
          </p>
          <p>
            <span>content</span>
            <textarea
              name="content"
              rows={12}
              placeholder="Write your article..."
              defaultValue={article.content}
            ></textarea>
          </p>
          <p>
            <button type="submit">Update</button>
          </p>
        </Form>
      </div>
    </>
  );
}
