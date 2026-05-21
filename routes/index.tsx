import { page } from "fresh";
import { define } from "../utils.ts";
import { Head } from "fresh/runtime";
import { addTodo, deleteTodo, getTodos, toggleTodo } from "../lib/todos.ts";
import TodoApp from "../islands/TodoApp.tsx";
import ThemeToggle from "../islands/ThemeToggle.tsx";

export const handler = define.handlers({
  GET(_ctx) {
    return page({ todos: getTodos() });
  },
  async POST(ctx) {
    const form = await ctx.req.formData();
    const action = form.get("_action");

    switch (action) {
      case "add": {
        const text = form.get("text") as string;
        if (text?.trim()) addTodo(text);
        break;
      }
      case "toggle": {
        const id = form.get("id") as string;
        toggleTodo(id);
        break;
      }
      case "delete": {
        const id = form.get("id") as string;
        deleteTodo(id);
        break;
      }
    }

    return new Response(null, {
      status: 303,
      headers: { Location: "/" },
    });
  },
});

export default define.page<typeof handler>(({ data }) => {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <div class="app">
        <header class="header">
          <h1>todos</h1>
          <p class="subtitle">fresh keeps it simple</p>
          <ThemeToggle />
        </header>
        <main class="main">
          <TodoApp todos={data.todos} />
        </main>
        <footer class="footer">
          <p>Click to toggle • Type to add</p>
        </footer>
      </div>
    </>
  );
});
