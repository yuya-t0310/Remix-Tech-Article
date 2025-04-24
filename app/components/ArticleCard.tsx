import { Link } from "@remix-run/react";
import { formatDate } from "../utils/commonFunction";
import type { selectedArticle } from "../types/articleTypes";

export default function ArticleCard({ article }: { article: selectedArticle }) {
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
