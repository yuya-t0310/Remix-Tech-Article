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
import { getSession } from "./sessions";

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
  return { userId };
};

export default function App() {
  const { userId } = useLoaderData<typeof loader>();

  return (
    <html lang="jp">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header userId={userId} />
        <div id="detail">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
