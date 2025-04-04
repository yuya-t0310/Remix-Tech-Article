import {
  LoaderFunctionArgs,
  ActionFunctionArgs,
  redirect,
} from "@remix-run/node";
import { requireUserSession } from "../data/auth.server";
import prisma from "../../lib/prisma";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";

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
  return { userId, profile };
}

export async function action({ request }: ActionFunctionArgs) {
  // ログイン状態でなければトップページへリダイレクト
  const userId = await requireUserSession(request, "/");

  const formData = await request.formData();
  const formUserId = formData.get("userId");

  // formとセッションのuserIdが異なる場合トップページへリダイレクト
  if (userId != formUserId) {
    return redirect("/");
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

  return redirect("/mypage");
}

export default function MyPage() {
  const { userId, profile } = useLoaderData<typeof loader>();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);

  return (
    <>
      <div>
        <p>マイページ</p>
      </div>
      <div>
        {isEditing ? (
          <Form method="post" onSubmit={() => setIsEditing(false)}>
            <p>
              ユーザ名:{" "}
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </p>
            <p>
              bio:{" "}
              <textarea
                name="bio"
                value={bio ? bio : ""}
                onChange={(e) => setBio(e.target.value)}
              />
            </p>
            <input type="hidden" name="userId" value={userId} />
            <div>
              <button type="submit">保存</button>
            </div>
          </Form>
        ) : (
          <>
            <div>
              <p>ユーザ名: {profile.name}</p>
              <p>bio: {profile.bio}</p>
            </div>
            <div>
              <button onClick={() => setIsEditing(true)}> 編集 </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
