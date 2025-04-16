import { useFetcher } from "@remix-run/react";

type Article = {
  id: number;
  title: string;
  content: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
  author: { profile: { name: string } | null };
  favoritedBy: { id: number; userId: number; articleId: number }[];
};

export default function Favorite({
  isFavorite,
  article,
}: {
  isFavorite: boolean;
  article: Article;
}) {
  const fetcher = useFetcher();
  // Optimistic UIのため
  // Network Conditionを3Gにするとわかりやすい
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : isFavorite;

  return (
    <div className="px-4 w-full text-right">
      <fetcher.Form method="post">
        <div className="justify-between">
          <button
            name="favorite"
            value={favorite ? "false" : "true"}
            className="text-lg font-bold text-yellow-500"
          >
            {favorite ? "★" : "☆"}
          </button>
          <span className="text-sm font-sm font-thin">
            {article.favoritedBy.length}
          </span>
        </div>
      </fetcher.Form>
    </div>
  );
}
