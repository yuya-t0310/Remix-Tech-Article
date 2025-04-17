import { Link } from "@remix-run/react";
import { formatDate } from "../utils/commonFunction";

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

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <>
      <div className="shadow-md max-w-96 p-4 m-2 bg-[#7ec7d8]/25">
        <Link to={`/article/${article.id}`}>
          <div className="text-xl line-clamp-1 hover:underline underline-offset-1 decoration-2">
            {article.title}
          </div>
        </Link>
        <div className="space-x-4">
          <span className="text-sm font-light hover:underline underline-offset-1 decoration-1">
            {article.author.profile?.name}
          </span>
          <span className="text-xs font-thin">
            {formatDate(article.createdAt)}
          </span>
          <span className="text-xs font-thin">
            ☆ {article.favoritedBy.length}
          </span>
        </div>
      </div>
    </>
  );
}
