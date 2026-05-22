import { page } from "fresh";
import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import { createSession, parseUsers, verifyPassword } from "../lib/auth.ts";

interface LoginData {
  error: string | null;
}

export const handler = define.handlers({
  GET(ctx) {
    if (ctx.state.user) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/" },
      });
    }
    const error = ctx.url.searchParams.get("error");
    return page<LoginData>({ error });
  },
  async POST(ctx) {
    const form = await ctx.req.formData();
    const username = (form.get("username") as string)?.trim();
    const password = form.get("password") as string;

    const users = parseUsers(Deno.env.get("USERS") || "");
    const stored = username ? users.get(username) : undefined;

    if (!stored || !(await verifyPassword(password, stored))) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/login?error=Invalid+username+or+password" },
      });
    }

    const secret = Deno.env.get("SESSION_SECRET");
    if (!secret) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/login?error=Server+configuration+error" },
      });
    }

    const session = await createSession(username, secret);

    return new Response(null, {
      status: 303,
      headers: {
        Location: "/",
        "Set-Cookie":
          `session=${session}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`,
      },
    });
  },
});

export default define.page<typeof handler>(({ data }) => {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <div class="login-page">
        <form class="login-form" method="POST">
          <h1>WeGotThis</h1>
          <p class="login-subtitle">sign in to continue</p>
          {data.error && <p class="login-error">{data.error}</p>}
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            autofocus
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <button class="login-btn" type="submit">Log in</button>
        </form>
      </div>
    </>
  );
});
