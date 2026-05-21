# todo-fresh

A simple todo app built with [Fresh 2.x](https://fresh.deno.dev/) — the
full-stack web framework for Deno.

## Tech Stack

| Layer        | Choice                                                    |
| ------------ | --------------------------------------------------------- |
| Runtime      | [Deno](https://deno.com/)                                 |
| Framework    | [Fresh 2.x](https://fresh.deno.dev/) + Preact + Vite      |
| State        | In-memory store (resets on server restart)                |
| Signals      | [`@preact/signals`](https://www.npmjs.com/package/@preact/signals) |

## Commands

| Purpose      | Command                                                    |
| ------------ | ---------------------------------------------------------- |
| Dev server   | `deno task dev`                                            |
| Build        | `deno task build`                                          |
| Prod start   | `deno task start`                                          |
| Full check   | `deno task check` (fmt → lint → typecheck)                 |
| Update Fresh | `deno task update`                                         |

## Setup

1. Install Deno: https://docs.deno.com/runtime/getting_started/installation
2. Clone the repo and start the dev server:

   ```sh
   deno task dev
   ```

3. Open the URL printed in the terminal (default `http://localhost:8000`).

## License

MIT
