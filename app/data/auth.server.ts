import { redirect } from "@remix-run/node";
import { commitSession, getSession } from "../sessions";
import { hash, compare } from "bcryptjs";
import { createUser, findUserByEmail } from "../db/user";

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
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return null;
  }

  // ユーザ登録
  const passwordHash = await hash(password, 12);
  const signUp = await createUser(email, passwordHash, userName);

  if (!signUp) {
    return null;
  }
  console.log("Signup sccessed!");

  const user = await findUserByEmail(email);
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
  const existingUser = await findUserByEmail(email);
  if (!existingUser) {
    return null;
  }

  // パスワードチェック
  const passwordCorrect = await compare(password, existingUser.password);
  if (!passwordCorrect) {
    return null;
  }

  // id取得
  const user = await findUserByEmail(email);

  return user ? user : null;
}

// セッションが正しくセットされていなければ指定パスへリダイレクト
export async function requireUserSession(
  request: Request,
  redirectPath: string
) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = await getUserFromSession(request);

  if (!userId) {
    session.flash("flashMessage", {
      color: "error",
      message: "無効な操作です。",
    });
    throw redirect(redirectPath, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  return userId;
}

// セッションからuserIdを取得する
export async function getUserFromSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));

  const userId: string | undefined = session.get("userId");

  if (!userId) {
    return null;
  }

  return userId;
}
