import { LoaderFunctionArgs } from "@remix-run/node";
import prisma from "../../lib/prisma";
import invariant from "tiny-invariant";
import { Form, Link, useLoaderData } from "@remix-run/react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  // article.$articleId.tsx → $xxxをparam.xxxで取得できる
  invariant(params.articleId, "Missing articleId param");
  const article = await prisma.article.findFirst({
    where: {
      id: parseInt(params.articleId),
    },
  });

  if (!article) {
    throw new Response("Not Found", { status: 404 });
  }

  // viewCountをインクリメント
  await prisma.article.update({
    where: {
      id: parseInt(params.articleId),
    },
    data: {
      viewCount: {
        increment: 1,
      },
      // 現在の値を設定
      updatedAt: article.updatedAt,
    },
  });

  return Response.json({ article });
};

export default function Article() {
  const { article } = useLoaderData<typeof loader>();
  console.log(article);

  return (
    <>
      <div id="article">
        <div>{article.title}</div>
        <div>{article.author}</div>
        <div>{article.content}</div>
        <div>{article.viewCount}</div>
      </div>
      <div>
        <Form action="edit">
          <button type="submit">Edit</button>
        </Form>
      </div>
      <div>
        <Form
          action="destroy"
          method="post"
          onSubmit={(event) => {
            const response = confirm(
              "Please confirm you want to delete this record."
            );
            if (!response) {
              event.preventDefault();
            }
          }}
        >
          <button type="submit">Delete</button>
        </Form>
      </div>
    </>
  );
}
