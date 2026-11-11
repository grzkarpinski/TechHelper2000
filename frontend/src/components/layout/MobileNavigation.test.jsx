import { act, cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import MobileNavigation from "./MobileNavigation";

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ user: { username: "admin", role: "admin" }, logout: vi.fn() }),
}));
vi.mock("@/context/ThemeContext", () => ({
  useTheme: () => ({ theme: "dark", toggleTheme: vi.fn() }),
}));

let desktop;
let onResize;
beforeEach(() => {
  desktop = { matches: false, addEventListener: vi.fn((_, callback) => { onResize = callback; }), removeEventListener: vi.fn() };
  vi.stubGlobal("matchMedia", () => desktop);
  render(<MemoryRouter><MobileNavigation /></MemoryRouter>);
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it("opens navigation and closes it after selecting a route", async () => {
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Otwórz menu nawigacji" }));
  const dialog = screen.getByRole("dialog", { name: "Nawigacja aplikacji" });
  await user.click(within(dialog).getByRole("link", { name: "Wiercenie" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

it("supports Escape, restores focus and closes when switching to desktop", async () => {
  const user = userEvent.setup();
  const trigger = screen.getByRole("button", { name: "Otwórz menu nawigacji" });
  await user.click(trigger);
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
  await user.click(trigger);
  act(() => { desktop.matches = true; onResize(); });
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
