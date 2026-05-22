import { useSignal } from "@preact/signals";
import ThemeToggle from "./ThemeToggle.tsx";

export default function Sidebar() {
  const open = useSignal(false);
  const yourListsOpen = useSignal(true);
  const sharedListsOpen = useSignal(true);

  return (
    <>
      <button
        type="button"
        class="sidebar-toggle"
        onClick={() => open.value = !open.value}
        aria-label="Toggle sidebar"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <line x1="3" y1="5" x2="17" y2="5" />
          <line x1="3" y1="10" x2="17" y2="10" />
          <line x1="3" y1="15" x2="17" y2="15" />
        </svg>
      </button>

      {open.value && (
        <div
          class="sidebar-overlay"
          onClick={() => open.value = false}
        />
      )}

      <aside class={`sidebar${open.value ? " open" : ""}`}>
        <div class="sidebar-heading">
          <span class="sidebar-title">WeGotThis</span>
          <ThemeToggle />
        </div>

        <nav class="sidebar-body">
          <button type="button" class="sidebar-new-list">
            + Create new list
          </button>

          <div class="sidebar-section">
            <button
              type="button"
              class="sidebar-section-toggle"
              onClick={() => yourListsOpen.value = !yourListsOpen.value}
            >
              Your lists
              <span class="sidebar-chevron">
                {yourListsOpen.value ? "▾" : "▸"}
              </span>
            </button>
            {yourListsOpen.value && (
              <div class="sidebar-section-content">
                <p class="sidebar-empty">No lists yet</p>
              </div>
            )}
          </div>

          <div class="sidebar-section">
            <button
              type="button"
              class="sidebar-section-toggle"
              onClick={() => sharedListsOpen.value = !sharedListsOpen.value}
            >
              Shared lists
              <span class="sidebar-chevron">
                {sharedListsOpen.value ? "▾" : "▸"}
              </span>
            </button>
            {sharedListsOpen.value && (
              <div class="sidebar-section-content">
                <p class="sidebar-empty">No shared lists</p>
              </div>
            )}
          </div>
        </nav>

        <div class="sidebar-footer">
          <a href="/logout" class="sidebar-logout">Logout</a>
        </div>
      </aside>
    </>
  );
}
