import { formatDate } from "../utils/commonFunction";
import type { selectedArticle } from "../types/articleTypes";

function ArticleViewerTitle({ article }: { article: selectedArticle }) {
  return (
    <>
      <div className="mt-8">
        <div className="m-4 w-full text-center text-4xl font-bold">
          {article.title}
        </div>

        <div className="m-2 w-full text-center font-light">
          {article.author.profile?.name}
        </div>

        <div className="m-2 w-full text-center text-sm font-thin justify-between">
          <span className="m-2">投稿:{formatDate(article.createdAt)}</span>
          <span className="m-2">更新:{formatDate(article.updatedAt)}</span>
        </div>
      </div>
    </>
  );
}

export default ArticleViewerTitle;
