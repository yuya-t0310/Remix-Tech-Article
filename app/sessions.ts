// app/sessions.ts
import { createCookieSessionStorage } from "@remix-run/node";

const SESSION_SECRET = process.env.SESSION_SECRET!;

type SessionData = {
  userId: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    // `createCookie` からの Cookie または Cookie を作成するための CookieOptions
    cookie: {
      name: "__session",
      httpOnly: true,
      maxAge: 3600,
      path: "/",
      sameSite: "lax",
      secrets: [SESSION_SECRET],
      secure: true,
    },
  });

export { getSession, commitSession, destroySession };
