import { App, staticFiles } from "fresh";
import { define, type State } from "./utils.ts";

function loadEnv() {
  try {
    const text = Deno.readTextFileSync(".env");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!Deno.env.get(key)) {
        Deno.env.set(key, value);
      }
    }
  } catch {
    // .env file not present
  }
}

loadEnv();

export const app = new App<State>();

app.use(staticFiles());

app.use(define.middleware((ctx) => {
  console.log(`${ctx.req.method} ${ctx.req.url}`);
  return ctx.next();
}));

app.fsRoutes();
