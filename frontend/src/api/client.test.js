import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiRequest, registerUnauthorizedHandler } from "./client";

describe("apiRequest", () => {
  beforeEach(() => {
    registerUnauthorizedHandler(null);
  });

  it("adds the stored JWT token", async () => {
    localStorage.setItem("auth_token", "test-token");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await apiRequest("/health");

    const options = fetchMock.mock.calls[0][1];
    expect(options.headers.get("Authorization")).toBe("Bearer test-token");
  });

  it("notifies the auth layer after a 401 response", async () => {
    const unauthorized = vi.fn();
    registerUnauthorizedHandler(unauthorized);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ detail: "Brak autoryzacji" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    ));

    await expect(apiRequest("/api/auth/me")).rejects.toThrow("Brak autoryzacji");
    expect(unauthorized).toHaveBeenCalledOnce();
  });
});
