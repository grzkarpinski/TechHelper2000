import { apiRequest } from "./client";

export function getMillingCutters() {
  return apiRequest("/api/tools/milling-cutters/");
}

export function getMillingCutter(id) {
  return apiRequest(`/api/tools/milling-cutters/${id}`);
}

export function createMillingCutter(data) {
  return apiRequest("/api/tools/milling-cutters/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateMillingCutter(id, data) {
  return apiRequest(`/api/tools/milling-cutters/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteMillingCutter(id) {
  return apiRequest(`/api/tools/milling-cutters/${id}`, {
    method: "DELETE",
  });
}
