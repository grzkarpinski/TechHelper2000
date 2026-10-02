import { readFileSync } from "node:fs";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import LoginPage from "@/pages/LoginPage";
import { ThemeProvider } from "./ThemeContext";

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ isAuthenticated: false, login: vi.fn() }),
}));

const bootstrap = readFileSync("index.html", "utf8")
  .match(/<script>([\s\S]*?)<\/script>/)[1];

function initializeTheme() {
  new Function("document", "localStorage", bootstrap)(document, localStorage);
}

function renderLogin() {
  return render(<MemoryRouter><ThemeProvider><LoginPage /></ThemeProvider></MemoryRouter>);
}

afterEach(() => {
  cleanup();
  document.documentElement.classList.remove("dark");
  vi.restoreAllMocks();
});

describe("theme selection", () => {
  it("defaults to dark and ignores invalid stored preferences", () => {
    initializeTheme();
    expect(document.documentElement).toHaveClass("dark");
    localStorage.setItem("machining-theme", "invalid");
    initializeTheme();
    expect(document.documentElement).toHaveClass("dark");
  });

  it("persists both themes, restores light on reload and keeps entered form values", () => {
    initializeTheme();
    const view = renderLogin();
    fireEvent.change(screen.getByLabelText("Login *"), { target: { value: "technolog" } });
    fireEvent.click(screen.getByRole("button", { name: "Włącz tryb jasny" }));
    expect(document.documentElement).not.toHaveClass("dark");
    expect(localStorage.getItem("machining-theme")).toBe("light");
    expect(screen.getByLabelText("Login *")).toHaveValue("technolog");
    view.unmount();
    document.documentElement.classList.add("dark");
    initializeTheme();
    renderLogin();
    expect(document.documentElement).not.toHaveClass("dark");
    fireEvent.click(screen.getByRole("button", { name: "Włącz tryb ciemny" }));
    expect(localStorage.getItem("machining-theme")).toBe("dark");
    expect(document.documentElement).toHaveClass("dark");
  });

  it("still switches when browser storage is unavailable", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    document.documentElement.classList.add("dark");
    initializeTheme();
    renderLogin();
    fireEvent.click(screen.getByRole("button", { name: "Włącz tryb jasny" }));
    expect(document.documentElement).not.toHaveClass("dark");
    expect(screen.getByRole("button", { name: "Włącz tryb ciemny" })).toBeInTheDocument();
  });
});
