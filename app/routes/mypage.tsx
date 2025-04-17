import { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { requireUserSession } from "../data/auth.server";
import prisma from "../../db/prisma";
import { useLoaderData } from "@remix-run/react";
import { setFlashMessage } from "../utils/session";
import MypageViewer from "../components/MypageViewer";
import ArticleCard from "~/components/ArticleCard";

export async function loader({ request }: LoaderFunctionArgs) {
  // ログイン状態でなければトップページへリダイレクト
  const userId = await requireUserSession(request, "/");
  let profile = await prisma.profile.findFirst({
    where: {
      userId: parseInt(userId),
    },
  });

  // profileが存在しなかった場合は新規作成する
  if (!profile) {
    profile = await prisma.profile.create({
      data: {
        name: "",
        bio: "",
        userId: parseInt(userId),
      },
    });
  }

  // 自分が作成した記事を取得
  const myArticle = await prisma.article.findMany({
    where: { authorId: parseInt(userId) },
    orderBy: { createdAt: "desc" },
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

  return { userId, profile, myArticle };
}

export async function action({ request }: ActionFunctionArgs) {
  // ログイン状態でなければトップページへリダイレクト
  const userId = await requireUserSession(request, "/");

  const formData = await request.formData();
  const formUserId = formData.get("userId");

  // formとセッションのuserIdが異なる場合トップページへリダイレクト
  if (userId != formUserId) {
    return setFlashMessage(
      request,
      { color: "error", message: "無効な操作です。" },
      "/"
    );
  }

  const updateData = Object.fromEntries(formData) as {
    name: string;
    bio: string;
  };

  // 保存処理
  const update = await prisma.profile.update({
    where: {
      userId: parseInt(userId),
    },
    data: {
      name: updateData.name,
      bio: updateData.bio,
    },
  });

  let message = { color: "success", message: "保存に成功しました。" };
  // TODO: アプリケーションエラーになる
  if (!update) {
    message = { color: "error", message: "保存に失敗しました。" };
  }

  return setFlashMessage(request, message, "/mypage");
}

export default function MyPage() {
  const { userId, profile, myArticle } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="text-xl font-bold">マイページ</div>

      <div className="m-4">
        <MypageViewer profile={profile} userId={userId} />
      </div>

      <div className="m-6">
        <span className="font-light">投稿記事一覧</span>

        <div className="m-4">
          {myArticle.length > 0 ? (
            <div>
              {myArticle.map((article) => {
                return (
                  <div key={article.id} className="m-2">
                    <ArticleCard article={article}></ArticleCard>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="font-thin">投稿記事はありません。</div>
          )}
        </div>
      </div>
    </>
  );
}
