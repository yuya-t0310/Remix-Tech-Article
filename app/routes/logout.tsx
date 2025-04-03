import { getSession, destroySession } from "../sessions";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

export default function LogoutRoute() {
  return (
    <>
      <p>本当にログアウトしますか？</p>
      <Form method="post">
        <button>ログアウト</button>
      </Form>
      <Link to="/">キャンセル</Link>
    </>
  );
}
