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

function ArticleViewerTitle({ article }: { article: Article }) {
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
