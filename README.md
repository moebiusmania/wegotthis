# WeGotThis

A simple todo app built with [Fresh 2.x](https://fresh.deno.dev/) — the
full-stack web framework for Deno.

## Tech Stack

| Layer     | Choice                                                             |
| --------- | ------------------------------------------------------------------ |
| Runtime   | [Deno](https://deno.com/)                                          |
| Framework | [Fresh 2.x](https://fresh.deno.dev/) + Preact + Vite               |
| State     | In-memory store (resets on server restart)                         |
| Signals   | [`@preact/signals`](https://www.npmjs.com/package/@preact/signals) |

## Commands

| Purpose      | Command                                    |
| ------------ | ------------------------------------------ |
| Dev server   | `deno task dev`                            |
| Build        | `deno task build`                          |
| Prod start   | `deno task start`                          |
| Full check   | `deno task check` (fmt → lint → typecheck) |
| Update Fresh | `deno task update`                         |

## Setup

1. Install Deno: https://docs.deno.com/runtime/getting_started/installation
2. Clone the repo, copy the env template, and create your users:

   ```sh
   cp .env.example .env
   deno task gensecret      # append output to .env
   deno task hashpwd alice  # repeat for bob (interactive if no args given)
   ```

3. Start the dev server:

   ```sh
   deno task dev
   ```

4. Open the URL printed in the terminal (default `http://localhost:8000`).

## Authentication

Every route except `/login` is protected by a Fresh middleware
(`routes/_middleware.ts`). On a GET or POST to `/login`, the server verifies the
password against a PBKDF2 hash stored in the `USERS` environment variable. On
success, it sets an HMAC-signed session cookie (HttpOnly, Secure, SameSite
strict, 7-day expiry). The middleware checks this cookie on every request; if
it's missing, expired, or tampered with, the user is redirected to `/login`.

- **2 users only** — passwords are configured via
  `USERS=user1:salt:hash,user2:...` in `.env`.
- **Zero external auth dependencies** — password hashing uses `crypto.subtle`
  (PBKDF2), session signing uses `crypto.subtle` (HMAC-SHA256).
- **No database** — users live entirely in the environment variable.
- To log out, visit `/logout`.

## License

Released under the [MIT license](LICENSE).
