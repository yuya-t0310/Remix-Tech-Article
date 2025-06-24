import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import type { selectedArticle } from "../types/articleTypes";

function ArticleViewerContent({ article }: { article: selectedArticle }) {
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
