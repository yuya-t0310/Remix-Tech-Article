import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";
import { getUserFromSession, requireUserSession } from "../data/auth.server";
import Favorite from "../components/Favorite";
import { setFlashMessage } from "../utils/session";
import ArticleViewerTitle from "../components/ArticleViewerTitle";
import ArticleViewerContent from "../components/ArticleViewerContent";
import EditBtn from "../components/EditBtn";
import DeleteBtn from "../components/DeleteBtn";
import { findArticleById, incrementArticleViewCount } from "../db/article";
import { findFavorite, addFavorite, removeFavorite } from "../db/favorite";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  // セッションからuserId取得
  const userId = await getUserFromSession(request);
  let isFavorite: boolean = false;

  // article.$articleId.tsx → $xxxをparam.xxxで取得できる
  invariant(params.articleId, "Missing articleId param");
  const article = await findArticleById(parseInt(params.articleId));

  if (!article) {
    throw new Response("Not Found", { status: 404 });
  }

  // ログイン済みの場合お気に入り登録した記事であるか確認
  if (userId) {
    const favorite = await findFavorite(
      parseInt(userId),
      parseInt(params.articleId)
    );
    if (favorite) {
      isFavorite = true;
    }
  }

  // リファラー(どのページからアクセスしたか)をチェックしてviewCountをインクリメント
  // 現在のページのURLを含んでいる場合はインクリメントしない
  // TODO: 初回のお気に入り登録・解除のみインクリメントされてしまう
  const referer = request.headers.get("Referer");
  console.log(referer);
  if (!referer || !referer.includes(request.url)) {
    await incrementArticleViewCount(
      parseInt(params.articleId),
      article.updatedAt
    );
  }

  return { article, userId, isFavorite };
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserSession(request, "/");
  invariant(params.articleId, "Missing articleId param");

  const formData = await request.formData();
  const favorite = formData.get("favorite");

  const actionFavorite =
    favorite === "true"
      ? addFavorite(parseInt(userId), parseInt(params.articleId))
      : removeFavorite(parseInt(userId), parseInt(params.articleId));

  if (!actionFavorite) {
    setFlashMessage(
      request,
      { color: "error", message: "処理に失敗しました。" },
      `/article/${params.articleId}`
    );
  }

  return redirect(`/article/${params.articleId}`);
};

export default function Article() {
  const { article, userId, isFavorite } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="m-4">
        <ArticleViewerTitle article={article} />
        {userId ? (
          <Favorite isFavorite={isFavorite} article={article} />
        ) : (
          <></>
        )}
        <ArticleViewerContent article={article} />
        {userId ? (
          parseInt(userId) == article.authorId ? (
            <div className="m-2 flex justify-between">
              <EditBtn />
              <DeleteBtn confirmMsg={"記事を削除します。よろしいですか？"} />
            </div>
          ) : (
            <></>
          )
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
