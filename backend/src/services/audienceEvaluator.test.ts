import { describe, expect, it } from "vitest";
import { evaluateAudience } from "./audienceEvaluator";

describe("evaluateAudience", () => {
  it("returns users who viewed a product at least twice and did not purchase", () => {
    const result = evaluateAudience({
      name: "Viewed but not purchased",
      asOf: "2026-09-29T00:00:00.000Z",
      conditions: [
        {
          eventType: "product_view",
          operator: "at_least",
          count: 2,
          withinDays: 7,
        },
        {
          eventType: "purchase",
          operator: "exactly",
          count: 0,
          withinDays: 7,
        },
      ],
    });

    expect(result).toHaveLength(2);

    expect(result.map((member) => member.anonymousId)).toEqual([
      "anon_001",
      "anon_004",
    ]);
  });

  it("includes the correct evidence for matching users", () => {
    const result = evaluateAudience({
      name: "Viewed but not purchased",
      asOf: "2026-09-29T00:00:00.000Z",
      conditions: [
        {
          eventType: "product_view",
          operator: "at_least",
          count: 2,
          withinDays: 7,
        },
        {
          eventType: "purchase",
          operator: "exactly",
          count: 0,
          withinDays: 7,
        },
      ],
    });

    const anon001 = result.find(
      (member) => member.anonymousId === "anon_001"
    );

    expect(anon001).toEqual({
      anonymousId: "anon_001",
      evidence: [
        {
          eventType: "product_view",
          observedCount: 3,
        },
        {
          eventType: "purchase",
          observedCount: 0,
        },
      ],
    });
  });
});