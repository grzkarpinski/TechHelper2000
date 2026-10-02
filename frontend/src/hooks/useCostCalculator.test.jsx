import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { calculateCost, calculateTimeFromCost } from "@/api/calculators";
import useCostCalculator from "./useCostCalculator";

vi.mock("@/api/calculators", () => ({ calculateCost: vi.fn(), calculateTimeFromCost: vi.fn() }));

const rates = [
  ["1", 110, 140, 161], ["2", 120, 140, 161], ["17", 90, 110, 150],
  ["4", 120, 185, 210], ["6", 140, 185, 210], ["7", 220, 310, 420],
  ["8", 180, 185, 210], ["10", 220, 410, 600], ["16", 220, 300, 400],
  ["18", 800, 500, 700], ["KJ", 100, 150, 185],
];
const cases = rates.flatMap(([group, ...values]) =>
  ["old", "new_2026", "external_2026"].map((kind, index) => [group, kind, values[index]]));

afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe("cost calculator requirements", () => {
  it.each(cases)("live values for group %s, tariff %s", (group, kind, rate) => {
    const { result } = renderHook(useCostCalculator);
    expect(result.current.rateType).toBe("new_2026");
    act(() => {
      result.current.changeRateType(kind);
      result.current.updateOperation(0, "group_id", group);
      result.current.updateOperation(0, "tpz", "15");
      result.current.updateOperation(0, "tj", "45");
    });
    expect(result.current.liveValue).toBeCloseTo(rate, 8);
    act(() => {
      result.current.changeMode("cost-to-time");
      result.current.updateOperation(0, "cost", String(rate / 4));
    });
    expect(result.current.liveValue).toBeCloseTo(15, 8);
  });

  it("submits selected rates and mode-specific fields, and clears obsolete results", async () => {
    calculateCost.mockResolvedValue({ total: 231.25 });
    calculateTimeFromCost.mockResolvedValue({ total_time_minutes: 75 });
    const { result } = renderHook(useCostCalculator);
    act(() => {
      result.current.updateOperation(0, "group_id", "6");
      result.current.updateOperation(0, "tpz", "30");
      result.current.updateOperation(0, "tj", "45");
    });
    await act(() => result.current.calculate());
    expect(calculateCost).toHaveBeenCalledWith([{ group_id: "6", tpz: 30, tj: 45 }], "new_2026");
    expect(result.current.liveValue).toBe(231.25);
    act(() => {
      result.current.changeMode("cost-to-time");
      result.current.updateOperation(0, "cost", "231.25");
    });
    expect(result.current.response).toBeNull();
    await act(() => result.current.calculate());
    expect(calculateTimeFromCost).toHaveBeenCalledWith([{ group_id: "6", cost: 231.25 }], "new_2026");
    expect(result.current.liveValue).toBe(75);
    act(() => result.current.changeRateType("old"));
    expect(result.current.response).toBeNull();
    act(() => result.current.clear());
    expect(result.current.operations).toHaveLength(1);
    expect(result.current.liveValue).toBe(0);
  });

  it("sums mixed groups and respects the ten-operation limit", () => {
    const { result } = renderHook(useCostCalculator);
    act(() => {
      result.current.updateOperation(0, "group_id", "6");
      result.current.updateOperation(0, "tpz", "30");
      result.current.updateOperation(0, "tj", "45");
      result.current.addOperation();
    });
    act(() => {
      result.current.updateOperation(1, "group_id", "1");
      result.current.updateOperation(1, "tpz", "15");
      result.current.updateOperation(1, "tj", "15");
    });
    expect(result.current.liveValue).toBe(301.25);
    for (let i = 0; i < 12; i++) act(() => result.current.addOperation());
    expect(result.current.operations).toHaveLength(10);
  });
});
