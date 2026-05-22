import { define } from "../../utils.ts";
import { createSession, parseUsers, verifyPassword } from "../../lib/auth.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const body = await ctx.req.json();
    const { username, password } = body;

    const users = parseUsers(Deno.env.get("USERS") || "");
    const stored = username ? users.get(username) : undefined;

    if (!stored || !(await verifyPassword(password, stored))) {
      return Response.json({ success: false, error: "Invalid credentials" }, {
        status: 401,
      });
    }

    const secret = Deno.env.get("SESSION_SECRET");
    if (!secret) {
      return Response.json(
        { success: false, error: "Server configuration error" },
        { status: 500 },
      );
    }

    const session = await createSession(username, secret);

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie":
          `session=${session}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`,
      },
    });
  },
});
