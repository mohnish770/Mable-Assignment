import db from "./database";

const insertEvent = db.prepare(`
  INSERT INTO events (anonymous_id, event_type, occurred_at)
  VALUES (?, ?, ?)
`);

const insertMany = db.transaction(() => {
  // anon_001 - Clear match
  insertEvent.run(
    "anon_001",
    "product_view",
    "2026-09-25T10:00:00.000Z"
  );

  insertEvent.run(
    "anon_001",
    "product_view",
    "2026-09-26T10:00:00.000Z"
  );

  insertEvent.run(
    "anon_001",
    "product_view",
    "2026-09-27T10:00:00.000Z"
  );

  // anon_002 - Not enough product views
  insertEvent.run(
    "anon_002",
    "product_view",
    "2026-09-27T10:00:00.000Z"
  );

  // anon_003 - Has purchased
  insertEvent.run(
    "anon_003",
    "product_view",
    "2026-09-25T10:00:00.000Z"
  );

  insertEvent.run(
    "anon_003",
    "product_view",
    "2026-09-26T10:00:00.000Z"
  );

  insertEvent.run(
    "anon_003",
    "product_view",
    "2026-09-27T10:00:00.000Z"
  );

  insertEvent.run(
    "anon_003",
    "purchase",
    "2026-09-28T10:00:00.000Z"
  );

  // anon_004 - Boundary case: exactly 2 product views
  insertEvent.run(
    "anon_004",
    "product_view",
    "2026-09-24T10:00:00.000Z"
  );

  insertEvent.run(
    "anon_004",
    "product_view",
    "2026-09-28T10:00:00.000Z"
  );

  // anon_005 - Product views exist, but outside the 7-day window
  insertEvent.run(
    "anon_005",
    "product_view",
    "2026-09-15T10:00:00.000Z"
  );

  insertEvent.run(
    "anon_005",
    "product_view",
    "2026-09-16T10:00:00.000Z"
  );

  insertEvent.run(
    "anon_005",
    "product_view",
    "2026-09-17T10:00:00.000Z"
  );

  // Additional event types
  insertEvent.run(
    "anon_001",
    "page_view",
    "2026-09-25T09:00:00.000Z"
  );

  insertEvent.run(
    "anon_001",
    "add_to_cart",
    "2026-09-26T11:00:00.000Z"
  );

  insertEvent.run(
    "anon_003",
    "checkout_started",
    "2026-09-28T09:30:00.000Z"
  );
});

insertMany();

console.log("Synthetic event data seeded successfully.");