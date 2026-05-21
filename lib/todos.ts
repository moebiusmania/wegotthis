export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

const todos: Todo[] = [];

export function getTodos(): Todo[] {
  return [...todos].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return a.createdAt - b.createdAt;
  });
}

export function addTodo(text: string): Todo {
  const todo: Todo = {
    id: crypto.randomUUID(),
    text: text.trim(),
    completed: false,
    createdAt: Date.now(),
  };
  todos.push(todo);
  return todo;
}

export function toggleTodo(id: string): Todo | undefined {
  const todo = todos.find((t) => t.id === id);
  if (todo) todo.completed = !todo.completed;
  return todo;
}

export function deleteTodo(id: string): boolean {
  const index = todos.findIndex((t) => t.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
    return true;
  }
  return false;
}
