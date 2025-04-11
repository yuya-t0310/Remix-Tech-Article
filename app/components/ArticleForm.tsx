import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Form } from "@remix-run/react";
import { Article } from "@prisma/client";

function ArticleForm({ article }: { article: Article | null }) {
  const [markdown, setMarkDown] = useState<string>(
    article ? article.content : ""
  );

  return (
    <Form id="article-form" method="post">
      <div className="m-2">
        <div className="font-light">タイトル</div>
        <input
          name="title"
          type="text"
          aria-label="Title"
          placeholder="タイトル"
          defaultValue={article ? article.title : ""}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7ec7d8] focus:border-[#7ec7d8] outline-none transition-colors"
        />
      </div>

      <div className="m-2">
        <div className="font-light">内容</div>
        <textarea
          value={markdown}
          onChange={(e) => setMarkDown(e.target.value)}
          aria-label="content"
          placeholder="Markdown記法が使用可能です。"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7ec7d8] focus:border-[#7ec7d8] outline-none transition-colors"
        />
        <input type="hidden" name="content" value={markdown} />
      </div>

      <div className="m-2">
        <div className="font-light">プレビュー</div>
        <div className="prose markdown-body max-w-none h-72 px-4 py-2 border border-gray-300 rounded-lg bg-white overflow-y-auto">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>

      <div className="m-2">
        <button
          type="submit"
          className="w-full bg-[#7ec7d8]/75 text-white font-medium py-2 px-4 rounded-lg hover:bg-[#7ec7d8] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {article ? "更新" : "投稿"}
        </button>
      </div>
    </Form>
  );
}

export default ArticleForm;
