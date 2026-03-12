import { apiRequest } from "./client";

export function calculateMilling(payload) {
  return apiRequest("/api/calculators/milling", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function calculateDrilling(payload) {
  return apiRequest("/api/calculators/drilling", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function calculateCost(operations, rateType) {
  return apiRequest(`/api/calculators/cost?rate_type=${encodeURIComponent(rateType)}`, {
    method: "POST",
    body: JSON.stringify(operations),
  });
}
