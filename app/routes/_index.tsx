import { useLoaderData } from "@remix-run/react";
import prisma from "../../lib/prisma";
import ArticleCard from "../components/ArticleCard";

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
      favoritedBy: {},
    },
  });

  return { latestArticles };
};

export default function Index() {
  const { latestArticles } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="text-xl font-bold">最新記事一覧</div>

      <div className="m-4">
        <nav>
          {latestArticles.length ? (
            <ul>
              {latestArticles.map((article) => {
                return (
                  <div key={article.id}>
                    <ArticleCard article={article} />
                  </div>
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
