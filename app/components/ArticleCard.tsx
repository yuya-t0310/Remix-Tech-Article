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
      <div className="shadow-md max-w-96 p-4 bg-[#7ec7d8]/25 rounded-md">
        <Link to={`/article/${article.id}`}>
          <div className="text-xl w-90 truncate hover:underline underline-offset-1 decoration-2">
            {article.title}
          </div>
        </Link>
        <div className="space-x-4 flex items-center">
          <span className="text-sm w-30 truncate font-light hover:underline underline-offset-1 decoration-1">
            {article.author.profile?.name}
          </span>
          <span className="text-xs font-thin">
            {formatDate(article.createdAt)}
          </span>
          <span className="text-xs font-thin">
            ☆ {article.favoritedBy.length}
          </span>
          <span className="space-x-1 flex items-center font-thin">
            <span className="i-iconoir-eye">{article.viewCount}</span>
            <span className="text-xs">{article.viewCount}</span>
          </span>
        </div>
      </div>
    </>
  );
}
