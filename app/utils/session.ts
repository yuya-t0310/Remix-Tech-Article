import { getSession, commitSession } from "../sessions";
import { redirect } from "@remix-run/node";

// フラッシュメッセージを設定し、指定パスへリダイレクトする
export async function setFlashMessage(
  request: Request,
  flashMessage: {
    color: string;
    message: string;
  },
  redirectPath: string
) {
  const session = await getSession(request.headers.get("Cookie"));
  session.flash("flashMessage", flashMessage);
  return redirect(redirectPath, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
