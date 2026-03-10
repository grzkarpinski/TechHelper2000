import { apiRequest } from "./client";

export function loginRequest(credentials) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function meRequest() {
  return apiRequest("/api/auth/me");
}
