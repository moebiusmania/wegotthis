import { useSignal } from "@preact/signals";

function getInitialTheme(): string {
  if (typeof document !== "undefined") {
    return document.documentElement.dataset.theme || "dark";
  }
  return "dark";
}

export default function ThemeToggle() {
  const theme = useSignal(getInitialTheme());

  function toggle() {
    const next = theme.value === "dark" ? "light" : "dark";
    theme.value = next;
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  }

  return (
    <button
      type="button"
      class="theme-toggle"
      onClick={toggle}
      aria-label="Toggle theme"
    >
      {theme.value === "dark" ? "☀" : "☾"}
    </button>
  );
}
