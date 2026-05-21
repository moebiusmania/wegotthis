import { assert, assertEquals, assertExists } from "@std/assert";
import { addTodo, deleteTodo, getTodos, toggleTodo } from "@/lib/todos.ts";

Deno.test("addTodo", async (t) => {
  await t.step("creates a todo with trimmed text", () => {
    const todo = addTodo("  hello  ");
    assertEquals(todo.text, "hello");
    assertEquals(todo.completed, false);
    assertExists(todo.id);
    assertExists(todo.createdAt);
  });

  await t.step("increments the todo list", () => {
    const before = getTodos().length;
    addTodo("another");
    assertEquals(getTodos().length, before + 1);
  });
});

Deno.test("getTodos", async (t) => {
  await t.step("returns a copy (not a reference)", () => {
    const a = getTodos();
    const b = getTodos();
    assertEquals(a, b);
    a.push({ id: "", text: "", completed: false, createdAt: 0 });
    assertEquals(a.length, b.length + 1);
  });

  await t.step("sorts incomplete todos before completed ones", () => {
    const t1 = addTodo("a");
    const t2 = addTodo("b");
    toggleTodo(t2.id);
    const all = getTodos();
    const t1idx = all.findIndex((t) => t.id === t1.id);
    const t2idx = all.findIndex((t) => t.id === t2.id);
    assert(t1idx < t2idx, "incomplete should come before completed");
  });

  await t.step("sorts by createdAt within same completion group", () => {
    let prev = 0;
    for (const t of getTodos()) {
      if (t.completed) continue;
      assert(t.createdAt >= prev, "should be in ascending order");
      prev = t.createdAt;
    }
  });
});

Deno.test("toggleTodo", async (t) => {
  await t.step("flips completed from false to true", () => {
    const todo = addTodo("toggle me");
    assertEquals(todo.completed, false);
    toggleTodo(todo.id);
    assertEquals(todo.completed, true);
  });

  await t.step("flips completed from true to false", () => {
    const todo = addTodo("toggle me again");
    toggleTodo(todo.id);
    assertEquals(todo.completed, true);
    toggleTodo(todo.id);
    assertEquals(todo.completed, false);
  });

  await t.step("returns undefined for unknown id", () => {
    const result = toggleTodo("nonexistent");
    assertEquals(result, undefined);
  });
});

Deno.test("deleteTodo", async (t) => {
  await t.step("removes an existing todo", () => {
    const before = getTodos().length;
    const todo = addTodo("delete me");
    const ok = deleteTodo(todo.id);
    assertEquals(ok, true);
    assertEquals(getTodos().length, before);
  });

  await t.step("returns false for unknown id", () => {
    const ok = deleteTodo("does-not-exist");
    assertEquals(ok, false);
  });
});
