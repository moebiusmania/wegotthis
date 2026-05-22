import { render } from "preact-render-to-string";
import { assertStringIncludes } from "@std/assert";
import Sidebar from "./Sidebar.tsx";

Deno.test("Sidebar renders hamburger toggle button", () => {
  const html = render(<Sidebar />);
  assertStringIncludes(html, 'class="sidebar-toggle"');
  assertStringIncludes(html, "Toggle sidebar");
});

Deno.test("Sidebar renders app title", () => {
  const html = render(<Sidebar />);
  assertStringIncludes(html, "WeGotThis");
  assertStringIncludes(html, 'class="sidebar-title"');
});

Deno.test("Sidebar renders theme toggle button", () => {
  const html = render(<Sidebar />);
  assertStringIncludes(html, 'class="theme-toggle"');
});

Deno.test("Sidebar renders Create new list button", () => {
  const html = render(<Sidebar />);
  assertStringIncludes(html, "Create new list");
  assertStringIncludes(html, 'class="sidebar-new-list"');
});

Deno.test("Sidebar renders Your lists section toggle", () => {
  const html = render(<Sidebar />);
  assertStringIncludes(html, "Your lists");
  assertStringIncludes(html, "▾");
});

Deno.test("Sidebar renders Shared lists section toggle", () => {
  const html = render(<Sidebar />);
  assertStringIncludes(html, "Shared lists");
  assertStringIncludes(html, "▾");
});

Deno.test("Sidebar renders logout link", () => {
  const html = render(<Sidebar />);
  assertStringIncludes(html, 'href="/logout"');
  assertStringIncludes(html, "Logout");
  assertStringIncludes(html, 'class="sidebar-logout"');
});

Deno.test("Sidebar renders collapsible sections as open by default", () => {
  const html = render(<Sidebar />);
  assertStringIncludes(html, "No lists yet");
  assertStringIncludes(html, "No shared lists");
  assertStringIncludes(html, 'class="sidebar-section-content"');
});

Deno.test("Sidebar renders sidebar class without open by default", () => {
  const html = render(<Sidebar />);
  assertStringIncludes(html, 'class="sidebar"');
});

Deno.test("Sidebar renders heading, body, and footer sections", () => {
  const html = render(<Sidebar />);
  assertStringIncludes(html, 'class="sidebar-heading"');
  assertStringIncludes(html, 'class="sidebar-body"');
  assertStringIncludes(html, 'class="sidebar-footer"');
});
