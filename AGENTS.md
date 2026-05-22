# WeGotThis

## Tech

- **Runtime:** Deno (not Node.js). Use `deno` commands, never `npm`/`node`.
- **Framework:** Fresh 2.x with Preact, Vite, `@preact/signals`.
- **Auth:** Zero-dependency — PBKDF2 (SHA-256, 100k iterations) for password hashing, HMAC-SHA256 for stateless session cookies. All crypto via `crypto.subtle` (Web Crypto API).
- **Formatter + Linter + Typecheck:** `deno fmt`, `deno lint`, `deno check`. Run together as `deno task check` (must run in that order).
- **No test framework configured** — no test task in `deno.json` (but tests exist in `lib/` and can be run with `deno test`).

## Commands

| Purpose           | Command                                                    |
| ----------------- | ---------------------------------------------------------- |
| Dev server        | `deno task dev` (runs `vite`)                              |
| Build             | `deno task build` (runs `vite build`, output to `_fresh/`) |
| Prod start        | `deno task start` (runs `deno serve -A _fresh/server.js`)  |
| Full check        | `deno task check` (fmt → lint → typecheck)                 |
| Update Fresh      | `deno task update`                                         |
| Generate password | `deno task hashpwd`                                        |
| Generate secret   | `deno task gensecret`                                      |
| Run tests         | `deno test -A`                                             |

## Architecture

### Todo app (pre-auth)

- **SSR:** `routes/index.tsx` handler calls `getTodos()`, passes data to `<TodoApp>` island via `page()`.
- **Mutations have two paths:**
  1. **No-JS fallback:** `POST /` with `_action` + form fields, returns 303 redirect.
  2. **JS island:** `POST /api/todos` with JSON body `{action, text, id}`, returns `{todos}`.
- **Data:** In-memory store in `lib/todos.ts` — resets on every server restart.

### Auth

- **Route protection middleware** (`routes/_middleware.ts`): all paths not in `PUBLIC_PATHS` (`/login`, `/logout`, static assets) require a valid session. Sets `ctx.state.user`.
- **SSR login:** `routes/login.tsx` — `GET` renders form, `POST` verifies credentials, sets `HttpOnly; Secure; SameSite=Strict` session cookie (7-day), redirects to `/`.
- **API login:** `routes/api/login.ts` — `POST` with JSON `{username, password}`, returns `{success: true}` + `Set-Cookie`.
- **Logout:** `routes/logout.ts` — clears session cookie, redirects to `/login`.
- **Session format:** `base64({username, expires}).base64(HMAC-SHA256(payload, SESSION_SECRET))` — stateless, no server-side store.
- **User store:** In-memory `Map` parsed from `USERS` env var (`user1:base64salt:base64hash,user2:...`). Users are pre-configured, no signup flow.
- **Login returns same error** ("Invalid username or password") for both missing user and wrong password (no enumeration).
- **State type** (`utils.ts`): `interface State { user?: string }` — `user` is set by middleware after session verification.

### Entrypoint

- `main.ts` creates the Fresh `App`, calls `loadEnv()` to read `.env`, registers `staticFiles()`, logging middleware, and `fsRoutes()`.
- `utils.ts` exports `define` (typed via `State`) — all routes/islands import from here, not from `fresh` directly.

## Conventions

- Imports: `@/` maps to project root (e.g. `@/utils.ts`, `@/lib/todos.ts`, `@/lib/auth.ts`).
- CSS for HMR imported in `client.ts` (`import "./assets/styles.css"`).
- Static files in `static/` served automatically by `staticFiles()` middleware.
- `_fresh/` is build output — gitignored.
- `.env` (gitignored) must contain `USERS` and `SESSION_SECRET`. See `.env.example` for format.
- VS Code: use `denoland.vscode-deno` extension; `deno.enable: true`.
