import { useSignal } from "@preact/signals";
import type { Todo } from "../lib/todos.ts";

interface TodoAppProps {
  todos: Todo[];
}

export default function TodoApp({ todos: initial }: TodoAppProps) {
  const todos = useSignal<Todo[]>(initial);
  const text = useSignal("");
  const removing = useSignal<Set<string>>(new Set());

  async function api(action: string, body: Record<string, unknown>) {
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...body }),
    });
    const data = await res.json();
    todos.value = data.todos;
    if (action === "delete") {
      const ids = new Set(data.todos.map((t: Todo) => t.id));
      removing.value = new Set([...removing.value].filter((id) => ids.has(id)));
    }
  }

  function add(e: Event) {
    e.preventDefault();
    if (!text.value.trim()) return;
    api("add", { text: text.value });
    text.value = "";
  }

  function toggle(id: string) {
    api("toggle", { id });
  }

  function remove(id: string) {
    removing.value = new Set([...removing.value, id]);
    setTimeout(() => {
      api("delete", { id });
    }, 250);
  }

  const active = todos.value.filter((t) => !t.completed).length;
  const done = todos.value.filter((t) => t.completed).length;

  return (
    <div class="todo-app">
      <form class="add-form" onSubmit={add}>
        <input
          type="text"
          class="add-input"
          placeholder="What needs to be done?"
          value={text}
          onInput={(e) => text.value = (e.target as HTMLInputElement).value}
        />
        <button class="add-btn" type="submit" disabled={!text.value.trim()}>
          Add
        </button>
      </form>

      {todos.value.length === 0
        ? (
          <p class="empty-state">
            No todos yet. Add one above!
          </p>
        )
        : (
          <ul class="todo-list">
            {todos.value.map((todo) => (
              <li
                key={todo.id}
                class={`todo-item ${todo.completed ? "completed" : ""}${
                  removing.value.has(todo.id) ? " removing" : ""
                }`}
              >
                <button
                  type="button"
                  class="toggle-btn"
                  onClick={() => toggle(todo.id)}
                  aria-label={todo.completed ? "Undo" : "Complete"}
                >
                  <span class="check">{todo.completed ? "✓" : ""}</span>
                </button>
                <span class="todo-text">{todo.text}</span>
                <button
                  type="button"
                  class="delete-btn"
                  onClick={() => remove(todo.id)}
                  aria-label="Delete"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

      {todos.value.length > 0 && (
        <div class="stats">
          <span>{active} left</span>
          {done > 0 && <span>{done} done</span>}
          <span>{todos.value.length} total</span>
        </div>
      )}
    </div>
  );
}
