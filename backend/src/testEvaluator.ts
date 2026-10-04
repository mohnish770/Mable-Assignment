import { evaluateAudience } from "./services/audienceEvaluator";

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

console.log(JSON.stringify(result, null, 2));