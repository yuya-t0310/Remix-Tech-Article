import { LoaderFunctionArgs } from "@remix-run/node";
import { requireUserSession } from "../data/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserSession(request, "/");
  return null;
}

export default function MyPage() {
  return (
    <div>
      <p>My page</p>
    </div>
  );
}
