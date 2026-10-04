import { describe, expect, it } from "vitest";
import { validateAudienceRequest } from "./audienceValidation";

describe("validateAudienceRequest", () => {
  it("accepts a valid audience request", () => {
    const result = validateAudienceRequest({
      name: "Viewed but not purchased",
      asOf: "2026-09-29T00:00:00.000Z",
      conditions: [
        {
          eventType: "product_view",
          operator: "at_least",
          count: 2,
          withinDays: 7,
        },
      ],
    });

    expect(result.valid).toBe(true);
  });

  it("rejects an invalid event type", () => {
    const result = validateAudienceRequest({
      name: "Invalid audience",
      asOf: "2026-09-29T00:00:00.000Z",
      conditions: [
        {
          eventType: "invalid_event",
          operator: "at_least",
          count: 2,
          withinDays: 7,
        },
      ],
    });

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.message).toBe("Invalid eventType");
    }
  });

  it("rejects an invalid operator", () => {
    const result = validateAudienceRequest({
      name: "Invalid audience",
      asOf: "2026-09-29T00:00:00.000Z",
      conditions: [
        {
          eventType: "product_view",
          operator: "greater_than",
          count: 2,
          withinDays: 7,
        },
      ],
    });

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.message).toBe("Invalid operator");
    }
  });

  it("rejects a negative count", () => {
    const result = validateAudienceRequest({
      name: "Invalid audience",
      asOf: "2026-09-29T00:00:00.000Z",
      conditions: [
        {
          eventType: "product_view",
          operator: "at_least",
          count: -1,
          withinDays: 7,
        },
      ],
    });

    expect(result.valid).toBe(false);
  });

  it("rejects an invalid date", () => {
    const result = validateAudienceRequest({
      name: "Invalid audience",
      asOf: "not-a-date",
      conditions: [
        {
          eventType: "product_view",
          operator: "at_least",
          count: 2,
          withinDays: 7,
        },
      ],
    });

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.message).toBe("asOf must be a valid ISO date");
    }
  });

  it("rejects an empty conditions array", () => {
    const result = validateAudienceRequest({
      name: "Invalid audience",
      asOf: "2026-09-29T00:00:00.000Z",
      conditions: [],
    });

    expect(result.valid).toBe(false);
  });
});