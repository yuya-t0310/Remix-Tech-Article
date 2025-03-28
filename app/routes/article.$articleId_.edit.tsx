import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, redirect, useLoaderData } from "@remix-run/react";
import prisma from "../../lib/prisma";
import invariant from "tiny-invariant";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.articleId, "Missing articleId param");
  const article = await prisma.article.findFirst({
    where: {
      id: parseInt(params.articleId),
    },
  });

  if (!article) {
    throw new Response("Not Found", { status: 404 });
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
      author: update.author as string,
      content: update.content as string,
    },
  });
  return redirect(`/article/${params.articleId}`);
};

export default function EditArticle() {
  const { article } = useLoaderData<typeof loader>();

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
              value={article.title}
            ></input>
          </p>
          <p>
            <span>Author</span>
            <input
              name="author"
              type="text"
              aria-label="Author"
              placeholder="Author"
              value={article.author}
            ></input>
          </p>
          <p>
            <span>content</span>
            <textarea
              name="content"
              rows={12}
              placeholder="Write your article..."
              value={article.content}
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
