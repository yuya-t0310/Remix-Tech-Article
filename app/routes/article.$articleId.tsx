import { LoaderFunctionArgs } from "@remix-run/node";
import prisma from "../../lib/prisma";
import invariant from "tiny-invariant";
import { Form, useLoaderData } from "@remix-run/react";
import { getUserFromSession } from "../data/auth.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  // セッションからuserId取得
  const userId = await getUserFromSession(request);
  // article.$articleId.tsx → $xxxをparam.xxxで取得できる
  invariant(params.articleId, "Missing articleId param");
  const article = await prisma.article.findFirst({
    where: {
      id: parseInt(params.articleId),
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

  return Response.json({ article, userId });
};

export default function Article() {
  const { article, userId } = useLoaderData<typeof loader>();
  console.log(userId);

  return (
    <>
      <div id="article">
        <div>タイトル {article.title}</div>
        <div>著者 {article.author.profile?.name}</div>
        <div>コンテンツ {article.content}</div>
        <div>閲覧数 {article.viewCount}</div>
      </div>
      {userId == article.authorId ? (
        <div>
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
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
