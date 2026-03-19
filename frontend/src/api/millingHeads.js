import { apiRequest } from "./client";

export function getMillingHeads() {
  return apiRequest("/api/tools/milling-heads/");
}

export function getMillingHead(id) {
  return apiRequest(`/api/tools/milling-heads/${id}`);
}

export function createMillingHead(data) {
  return apiRequest("/api/tools/milling-heads/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateMillingHead(id, data) {
  return apiRequest(`/api/tools/milling-heads/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteMillingHead(id) {
  return apiRequest(`/api/tools/milling-heads/${id}`, {
    method: "DELETE",
  });
}
