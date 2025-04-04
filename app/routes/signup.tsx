import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { getSession, commitSession } from "../sessions";
import { signup } from "../data/auth.server";

// ログイン済であればホームページにリダイレクト
export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("userId")) {
    return redirect("/");
  }

  const data = { error: session.get("error") };

  return Response.json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
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
    session.flash("error", "サインアップに失敗しました。");
    return redirect("/signup", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  // サインアップ成功
  session.set("userId", String(user.id));
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function SignUp() {
  const { error } = useLoaderData<typeof loader>();

  return (
    <div>
      {error ? <div className="error">{error}</div> : null}
      <Form method="post">
        <div>
          <p>サインアップ</p>
        </div>
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
