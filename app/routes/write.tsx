import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { requireUserSession } from "../data/auth.server";
import { setFlashMessage } from "../utils/session";
import ArticleForm from "../components/ArticleForm";
import { createArticle } from "../db/article";

// ログイン状態でなければトップページへリダイレクト
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserSession(request, "/");
  return null;
};

// DBに登録
export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserSession(request, "/");
  const formData = await request.formData();
  const tags: string[] = [];

  // タグ配列の作成
  for (let i = 0; formData.has(`tag_${i}`); i++) {
    const tag: string = formData.get(`tag_${i}`) as string;
    if (tag && tag.trim() !== "") {
      tags.push(tag);
    }
  }

  // 記事作成
  const article = await createArticle(
    formData.get("title") as string,
    parseInt(userId),
    formData.get("content") as string,
    tags
  );

  let message = { color: "success", message: "投稿に成功しました。" };
  // TODO: アプリケーションエラーになる
  if (!article) {
    message = { color: "error", message: "投稿に失敗しました。" };
  }

  return setFlashMessage(request, message, "/");
};

export default function WriteArticle() {
  return (
    <>
      <div className="text-xl font-bold">記事作成</div>
      <div className="m-4">
        <ArticleForm article={null} />
      </div>
    </>
  );
}
