import { apiRequest } from "./client";

export function getDrills() {
  return apiRequest("/api/tools/drills/");
}

export function getDrill(id) {
  return apiRequest(`/api/tools/drills/${id}`);
}

export function createDrill(data) {
  return apiRequest("/api/tools/drills/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateDrill(id, data) {
  return apiRequest(`/api/tools/drills/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteDrill(id) {
  return apiRequest(`/api/tools/drills/${id}`, {
    method: "DELETE",
  });
}
