import { define } from "../utils.ts";

export const handler = define.handlers({
  GET() {
    return new Response(null, {
      status: 303,
      headers: {
        Location: "/login",
        "Set-Cookie":
          "session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0",
      },
    });
  },
});
