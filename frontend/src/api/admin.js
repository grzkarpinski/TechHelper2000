import { apiRequest } from "./client";

export function getUsers() {
  return apiRequest("/api/admin/users");
}

export function createUser(data) {
  return apiRequest("/api/admin/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateUser(id, data) {
  return apiRequest(`/api/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteUser(id) {
  return apiRequest(`/api/admin/users/${id}`, {
    method: "DELETE",
  });
}
