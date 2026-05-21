# todo-fresh

## Tech

- **Runtime:** Deno (not Node.js). Use `deno` commands, never `npm`/`node`.
- **Framework:** Fresh 2.x with Preact, Vite, `@preact/signals`.
- **Formatter + Linter + Typecheck:** `deno fmt`, `deno lint`, `deno check`. Run
  together as `deno task check` (must run in that order).
- **No test framework configured** — no test task in `deno.json`.

## Commands

| Purpose      | Command                                                    |
| ------------ | ---------------------------------------------------------- |
| Dev server   | `deno task dev` (runs `vite`)                              |
| Build        | `deno task build` (runs `vite build`, output to `_fresh/`) |
| Prod start   | `deno task start` (runs `deno serve -A _fresh/server.js`)  |
| Full check   | `deno task check` (fmt → lint → typecheck)                 |
| Update Fresh | `deno task update`                                         |

## Architecture

- **SSR:** `routes/index.tsx` handler calls `getTodos()`, passes data to
  `<TodoApp>` island via `page()`.
- **Mutations have two paths:**
  1. **No-JS fallback:** `POST /` with `_action` + form fields, returns 303
     redirect.
  2. **JS island:** `POST /api/todos` with JSON body `{action, text, id}`,
     returns `{todos}`.
- **Data:** In-memory store in `lib/todos.ts` — resets on every server restart.
- **Entrypoint:** `main.ts` creates the Fresh `App`, registers `staticFiles()`,
  logging middleware, and `fsRoutes()`.
- **`utils.ts`** exports `define` (typed via `State` interface) — all
  routes/islands import from here, not from `fresh` directly.

## Conventions

- Imports: `@/` maps to project root (e.g. `@/utils.ts`, `@/lib/todos.ts`).
- CSS for HMR imported in `client.ts` (`import "./assets/styles.css"`).
- Static files in `static/` served automatically by `staticFiles()` middleware.
- `_fresh/` is build output — gitignored.
- VS Code: use `denoland.vscode-deno` extension; `deno.enable: true`.
