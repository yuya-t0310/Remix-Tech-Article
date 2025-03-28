import { Link, useLoaderData } from "@remix-run/react";
import prisma from "../../lib/prisma";

export const loader = async () => {
  const latestArticles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return Response.json({ latestArticles });
};

export default function Index() {
  const { latestArticles } = useLoaderData<typeof loader>();

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
                        {article.title} {article.author}
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
