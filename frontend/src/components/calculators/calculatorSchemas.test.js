import { describe, expect, it } from "vitest";

import { drillingSchema, millingSchema } from "./calculatorSchemas";

describe("millingSchema", () => {
  it("accepts one speed and one feed value", () => {
    const result = millingSchema.safeParse({ vc: 100, fz: 0.2, d: 50, z: 4 });
    expect(result.success).toBe(true);
  });

  it("rejects mutually exclusive values provided together", () => {
    const result = millingSchema.safeParse({ vc: 100, n: 500, fz: 0.2, d: 50, z: 4 });
    expect(result.success).toBe(false);
  });

  it("rejects non-positive dimensions", () => {
    const result = millingSchema.safeParse({ vc: 100, fz: 0.2, d: 0, z: 4 });
    expect(result.success).toBe(false);
  });
});

describe("drillingSchema", () => {
  it("requires exactly one feed value", () => {
    const missing = drillingSchema.safeParse({ vc: 80, d: 10 });
    const valid = drillingSchema.safeParse({ vc: 80, fn: 0.1, d: 10 });
    expect(missing.success).toBe(false);
    expect(valid.success).toBe(true);
  });
});
