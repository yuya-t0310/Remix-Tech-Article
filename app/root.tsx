import {
  Links,
  Link,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import Header from "./components/Header";

import styles from "./tailwind.css?url";
import { getSession, commitSession } from "./sessions";
import FlashMessage from "./components/FlashMessage";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
];

// export function Layout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="jp">
//       <head>
//         <meta charSet="utf-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <Meta />
//         <Links />
//       </head>
//       <body>
//         {children}
//         <ScrollRestoration />
//         <Scripts />
//       </body>
//     </html>
//   );
// }

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const flashMessageData = session.get("flashMessage") || null;

  return Response.json(
    { userId, flashMessageData },
    {
      // 読み取り後のセッションに更新(flashの削除)
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};

export default function App() {
  const { userId, flashMessageData } = useLoaderData<typeof loader>();

  return (
    <html lang="jp">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-[#7ec7d8]/25">
        <Header userId={userId} />
        {flashMessageData ? (
          <FlashMessage flashMessage={flashMessageData} />
        ) : (
          <></>
        )}
        <div id="detail" className="m-4">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
