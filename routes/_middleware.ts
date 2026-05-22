import { define } from "../utils.ts";
import { parseUsers, verifySession } from "../lib/auth.ts";

const PUBLIC_PATHS = new Set([
  "/login",
  "/logout",
  "/manifest.json",
  "/theme-init.js",
  "/favicon.ico",
]);

export const handler = define.middleware(async (ctx) => {
  const { pathname } = ctx.url;
  if (PUBLIC_PATHS.has(pathname)) {
    return ctx.next();
  }

  const secret = Deno.env.get("SESSION_SECRET");
  if (!secret) {
    return new Response(null, {
      status: 303,
      headers: { Location: "/login" },
    });
  }

  const cookie = ctx.req.headers.get("Cookie")?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("session="))
    ?.slice(8);

  if (!cookie) {
    return new Response(null, {
      status: 303,
      headers: { Location: "/login" },
    });
  }

  const username = await verifySession(cookie, secret);
  if (!username) {
    return new Response(null, {
      status: 303,
      headers: { Location: "/login" },
    });
  }

  const users = parseUsers(Deno.env.get("USERS") || "");
  if (!users.has(username)) {
    return new Response(null, {
      status: 303,
      headers: { Location: "/login" },
    });
  }

  ctx.state.user = username;
  return ctx.next();
});
