import { Link, useLoaderData } from "@remix-run/react";
import prisma from "../../lib/prisma";

export const loader = async () => {
  // selectオプションを使用してパスワード等を取得しないようにする
  const latestArticles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
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

  return Response.json({ latestArticles });
};

export default function Index() {
  const { latestArticles } = useLoaderData<typeof loader>();
  console.log(latestArticles);

  return (
    <>
      <div>TOP PAGE</div>
      <div>
        <nav>
          {latestArticles.length ? (
            <ul>
              {latestArticles.map((article) => {
                return (
                  <li key={article.id}>
                    <Link to={`article/${article.id}`}>
                      <>
                        {article.title} {article.author.profile?.name}
                      </>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>
              <i>No article</i>
            </p>
          )}{" "}
        </nav>
      </div>
    </>
  );
}
