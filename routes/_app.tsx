import { define } from "../utils.ts";
import Sidebar from "../islands/Sidebar.tsx";

export default define.page(function App({ Component }) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/manifest.json" />
        <title>todos</title>
        <script src="/theme-init.js"></script>
      </head>
      <body>
        <div class="app-layout">
          <Sidebar />
          <div class="app-content">
            <Component />
          </div>
        </div>
      </body>
    </html>
  );
});
