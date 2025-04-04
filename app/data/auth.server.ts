import { redirect } from "@remix-run/node";
import { getSession } from "../sessions";
import { hash, compare } from "bcryptjs";
import prisma from "../../lib/prisma";

// サインアップ
export async function signup({
  userName,
  email,
  password,
}: {
  userName: string;
  email: string;
  password: string;
}) {
  // 同じメールアドレスが登録されているかチェック
  const existingUser = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (existingUser) {
    return null;
  }

  // ユーザ登録
  const passwordHash = await hash(password, 12);
  const signUp = await prisma.user.create({
    // Nested writesで子要素のProfileも同時に生成(トランザクション処理と同義となる)
    data: {
      email: email,
      password: passwordHash,
      profile: {
        create: {
          name: userName,
          bio: "",
          // userIdは自動的にUserと関連付けられる
        },
      },
    },
  });

  if (!signUp) {
    return null;
  }
  console.log("Signup sccessed!");

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (!user) {
    return null;
  }

  return user;
}

// ログインチェック
export async function validateCredentials({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  // 同じメールアドレスが登録されているかチェック
  const existingUser = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (!existingUser) {
    return null;
  }

  // パスワードチェック
  const passwordCorrect = await compare(password, existingUser.password);
  if (!passwordCorrect) {
    return null;
  }

  // id取得
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  return user ? user : null;
}

// セッションが正しくセットされていなければ指定パスへリダイレクト
export async function requireUserSession(
  request: Request,
  redirectPath: string
) {
  const userId = await getUserFromSession(request);

  if (!userId) {
    throw redirect(redirectPath);
  }

  return userId;
}

// セッションからuserIdを取得する
export async function getUserFromSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));

  const userId: string | undefined = session.get("userId");
  console.log("userID:", userId);

  if (!userId) {
    return null;
  }

  return userId;
}
