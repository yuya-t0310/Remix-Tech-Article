import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { getSession } from "../sessions";
import { signup } from "../data/auth.server";
import { setFlashMessage } from "../utils/session";

// ログイン済であればホームページにリダイレクト
export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("userId")) {
    return redirect("/");
  }

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const formData = await request.formData();
  const signupData = Object.fromEntries(formData) as {
    userName: string;
    email: string;
    password: string;
  };

  const user = await signup(signupData);

  // TODO: メールアドレスが被った場合を切り分ける
  // サインアップ失敗
  if (user == null) {
    return setFlashMessage(
      request,
      { color: "error", message: "サインアップに失敗しました。" },
      "/signup"
    );
  }

  // サインアップ成功
  session.set("userId", String(user.id));
  return setFlashMessage(
    request,
    { color: "success", message: "サインアップに成功しました。" },
    "/"
  );
}

export default function SignUp() {
  return (
    <div>
      <Form method="post">
        <div className="text-xl font-bold">サインアップ</div>
        <p>
          <label>
            ユーザ名: <input type="text" name="userName" required />
          </label>
        </p>
        <p>
          <label>
            メールアドレス: <input type="email" name="email" required />
          </label>
        </p>
        <p>
          <label>
            パスワード: <input type="password" name="password" />
          </label>
        </p>
        <div>
          <button> サインアップ </button>
        </div>
      </Form>
    </div>
  );
}
