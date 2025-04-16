import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import prisma from "../../lib/prisma";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";
import { getUserFromSession, requireUserSession } from "../data/auth.server";
import Favorite from "../components/Favorite";
import { setFlashMessage } from "../utils/session";
import ArticleViewerTitle from "../components/ArticleViewerTitle";
import ArticleViewerContent from "../components/ArticleViewerContent";
import EditButtons from "../components/EditButtons";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  // セッションからuserId取得
  const userId = await getUserFromSession(request);
  let isFavorite: boolean = false;

  // article.$articleId.tsx → $xxxをparam.xxxで取得できる
  invariant(params.articleId, "Missing articleId param");
  const article = await prisma.article.findFirst({
    where: {
      id: parseInt(params.articleId),
    },
    include: {
      author: {
        select: {
          profile: {
            select: {
              name: true,
            },
          },
        },
      },
      favoritedBy: {},
    },
  });

  if (!article) {
    throw new Response("Not Found", { status: 404 });
  }

  // ログイン済みの場合お気に入り登録した記事であるか確認
  if (userId) {
    const favorite = await prisma.favorite.findFirst({
      where: {
        userId: parseInt(userId),
        articleId: parseInt(params.articleId),
      },
    });
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
    await prisma.article.update({
      where: {
        id: parseInt(params.articleId),
      },
      data: {
        viewCount: {
          increment: 1,
        },
        // 現在の値を設定
        updatedAt: article.updatedAt,
      },
    });
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
      ? addFavorite({ userId: userId, articleId: params.articleId })
      : removeFavorite({ userId: userId, articleId: params.articleId });

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
            <EditButtons />
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

// 記事をお気に入り登録
async function addFavorite({
  userId,
  articleId,
}: {
  userId: string;
  articleId: string;
}) {
  return await prisma.favorite.create({
    data: {
      userId: parseInt(userId),
      articleId: parseInt(articleId),
    },
  });
}

// 記事のお気に入り登録を解除
async function removeFavorite({
  userId,
  articleId,
}: {
  userId: string;
  articleId: string;
}) {
  return await prisma.favorite.delete({
    where: {
      favoriteId: {
        userId: parseInt(userId),
        articleId: parseInt(articleId),
      },
    },
  });
}
