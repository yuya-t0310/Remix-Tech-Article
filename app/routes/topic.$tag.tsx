import { LoaderFunctionArgs } from "@remix-run/node";
import { LoadConfigFromFileError } from "prisma_files/@prisma/config/dist";
import invariant from "tiny-invariant";
import { findArticleByTag } from "../db/article";
import { useLoaderData } from "@remix-run/react";
import ArticleCard from "~/components/ArticleCard";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  // tagから記事を取得
  invariant(params.tag, "Missing tag param");
  const articles = await findArticleByTag(params.tag);

  return { params, articles };
};

export const action = async () => {};

export default function Topic() {
  const { params, articles } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="text-xl font-bold">{params.tag}</div>

      <div className="m-4">
        <nav>
          {articles.length ? (
            <ul>
              {articles.map((article) => {
                return (
                  <div key={article.id} className="m-2">
                    <ArticleCard article={article} />
                  </div>
                );
              })}
            </ul>
          ) : (
            <p>
              <i>No Article</i>
            </p>
          )}{" "}
        </nav>
      </div>
    </>
  );
}
