import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

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

function ArticleViewerContent({ article }: { article: Article }) {
  return (
    <>
      <div className="prose markdown-body max-w-none max-h-none px-4 py-2 border border-gray-300 rounded-lg bg-white">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {article.content}
        </ReactMarkdown>
      </div>
    </>
  );
}

export default ArticleViewerContent;
