import { define } from "../../utils.ts";
import { addTodo, deleteTodo, getTodos, toggleTodo } from "../../lib/todos.ts";

export const handler = define.handlers({
  GET() {
    return Response.json({ todos: getTodos() });
  },
  async POST(ctx) {
    const body = await ctx.req.json();
    const { action, id, text } = body;

    switch (action) {
      case "add":
        if (text?.trim()) addTodo(text);
        break;
      case "toggle":
        toggleTodo(id);
        break;
      case "delete":
        deleteTodo(id);
        break;
    }

    return Response.json({ todos: getTodos() });
  },
});
