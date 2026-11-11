import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { toast } from "sonner";

import { developmentSessionRequest, meRequest } from "@/api/auth";
import { AuthProvider, useAuth } from "./AuthContext";

vi.mock("@/api/auth", () => ({
  developmentSessionRequest: vi.fn(), meRequest: vi.fn(), loginRequest: vi.fn(),
}));
vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));

function SessionStatus() {
  const { user, isLoading } = useAuth();
  return <span>{isLoading ? "loading" : user?.username || "guest"}</span>;
}

function renderSession() {
  render(<MemoryRouter><AuthProvider><SessionStatus /></AuthProvider></MemoryRouter>);
}

afterEach(() => { cleanup(); vi.unstubAllEnvs(); vi.resetAllMocks(); });

it("automatically opens a development admin session even with an old stored token", async () => {
  vi.stubEnv("DEV", true);
  vi.stubEnv("VITE_DEV_ADMIN", "true");
  localStorage.setItem("auth_token", "old-token");
  developmentSessionRequest.mockResolvedValue({ access_token: "development-token" });
  meRequest.mockResolvedValue({ username: "Administrator DEV", role: "admin" });
  renderSession();
  expect(await screen.findByText("Administrator DEV")).toBeInTheDocument();
  expect(localStorage.getItem("auth_token")).toBe("development-token");
});

it.each([[false, "true"], [true, "false"]])("does not auto-login with DEV=%s and flag=%s", async (dev, flag) => {
  vi.stubEnv("DEV", dev);
  vi.stubEnv("VITE_DEV_ADMIN", flag);
  renderSession();
  expect(await screen.findByText("guest")).toBeInTheDocument();
  expect(developmentSessionRequest).not.toHaveBeenCalled();
});

it("reports development login failures and clears the old token", async () => {
  vi.stubEnv("DEV", true);
  vi.stubEnv("VITE_DEV_ADMIN", "true");
  localStorage.setItem("auth_token", "old-token");
  developmentSessionRequest.mockRejectedValue(new Error("unavailable"));
  renderSession();
  await waitFor(() => expect(toast.error).toHaveBeenCalled());
  expect(screen.getByText("guest")).toBeInTheDocument();
  expect(localStorage.getItem("auth_token")).toBeNull();
});
