import { ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import prisma from "../../lib/prisma";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const insert = Object.fromEntries(formData);

  await prisma.article.create({
    data: {
      title: insert.title as string,
      author: insert.author as string,
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
            ></input>
          </p>
          <p>
            <span>Author</span>
            <input
              name="author"
              type="text"
              aria-label="Author"
              placeholder="Author"
            ></input>
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
            <button type="submit">Publish Article</button>
          </p>
        </Form>
      </div>
    </>
  );
}
