import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"; // または cloudflare/deno
import { redirect } from "@remix-run/node"; // または cloudflare/deno
import { Form, useLoaderData } from "@remix-run/react";

import { getSession, commitSession } from "../sessions";
import { validateCredentials } from "../data/auth.server";

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
  const loginData = Object.fromEntries(formData) as {
    email: string;
    password: string;
  };

  const user = await validateCredentials(loginData);

  // ログイン失敗
  if (user == null) {
    session.flash("error", "無効なユーザ名/パスワードです。");
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  // ログイン成功
  session.set("userId", String(user.id));
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Login() {
  const { error } = useLoaderData<typeof loader>();

  return (
    <div>
      {error ? <div className="error">{error}</div> : null}
      <Form method="post">
        <div>
          <p>ログイン</p>
        </div>
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
          <button> ログイン </button>
        </div>
      </Form>
    </div>
  );
}
