import { useLoaderData } from "@remix-run/react";
import ArticleCard from "../components/ArticleCard";
import { findLatestArticles } from "../db/article";

export const loader = async () => {
  // 最新記事取得
  const latestArticles = await findLatestArticles();

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
                  <div key={article.id} className="m-2">
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
