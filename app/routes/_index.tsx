import { Link, useLoaderData } from "@remix-run/react";
import prisma from "../../lib/prisma";

export const loader = async () => {
  // 最新記事取得 selectオプションを使用してパスワード等を取得しないようにする
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

  return { latestArticles };
};

export default function Index() {
  const { latestArticles } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="text-xl font-bold">トップページ</div>

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
